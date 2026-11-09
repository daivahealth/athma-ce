// Run: npm test (in plugins/oncology) — uses node:test via tsx from backend/node_modules.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  classifyImaging,
  classifyPathology,
  groupByPatient,
  isCancerIcdCode,
  isCandidateSourceType,
} from './registry-candidates';

describe('classifyPathology', () => {
  it('flags a positive malignancy diagnosis', () => {
    const m = classifyPathology({ diagnosis: 'Left breast, core biopsy: Invasive ductal carcinoma, grade 2.' });
    assert.ok(m);
    assert.deepEqual(m.matchedTerms, ['carcinoma']);
    assert.match(m.excerpt, /Invasive ductal carcinoma/);
  });

  it('ignores negative statements', () => {
    assert.equal(classifyPathology({ diagnosis: 'Negative for malignancy. Chronic gastritis.' }), null);
    assert.equal(classifyPathology({ diagnosis: 'No evidence of carcinoma or dysplasia.' }), null);
    assert.equal(classifyPathology({ diagnosis: 'Benign fibroadenoma. No atypia.' }), null);
  });

  it('keeps the positive clause when a later clause is negative', () => {
    const m = classifyPathology({ diagnosis: 'Sigmoid colon malignancy with regional nodal involvement; no distant metastasis (cT3 N1 M0).' });
    assert.ok(m);
    assert.deepEqual(m.matchedTerms, ['malignancy']);
  });

  it('recognises haematological and other malignancies', () => {
    assert.ok(classifyPathology({ diagnosis: 'Diffuse large B-cell lymphoma, CD20 positive.' }));
    assert.ok(classifyPathology({ diagnosis: 'Acute myeloid leukemia.' }));
    assert.ok(classifyPathology({ diagnosis: 'Glioblastoma, IDH-wildtype.' }));
    assert.ok(classifyPathology({ diagnosis: 'Ductal carcinoma in situ (DCIS), high nuclear grade.' }));
  });

  it('falls back to the comment when the diagnosis is empty', () => {
    assert.ok(classifyPathology({ diagnosis: null, comment: 'Features are those of metastatic adenocarcinoma.' }));
  });
});

describe('classifyImaging', () => {
  it('flags RADS scores of 4 and above', () => {
    assert.ok(classifyImaging({ impression: 'BI-RADS 5, highly suggestive of malignancy. Biopsy recommended.' }));
    assert.ok(classifyImaging({ impression: 'Lung-RADS 4B nodule right upper lobe.' }));
    assert.ok(classifyImaging({ impression: 'PI-RADS 4 lesion in the left peripheral zone.' }));
    assert.ok(classifyImaging({ impression: 'LI-RADS 5 observation segment VII.' }));
  });

  it('does not flag low RADS scores', () => {
    assert.equal(classifyImaging({ impression: 'BI-RADS 2, benign findings.' }), null);
    assert.equal(classifyImaging({ impression: 'Lung-RADS 2.' }), null);
  });

  it('flags suspicious wording', () => {
    const m = classifyImaging({ impression: 'Findings highly suspicious for primary lung malignancy; tissue diagnosis recommended.' });
    assert.ok(m);
    assert.ok(m.matchedTerms.includes('suspicious for malignancy'));
  });

  it('ignores follow-up scans that report no disease', () => {
    assert.equal(classifyImaging({ impression: 'No evidence of recurrent or metastatic disease at 1 year.' }), null);
  });
});

describe('isCancerIcdCode', () => {
  it('accepts malignant and in-situ codes only', () => {
    assert.equal(isCancerIcdCode('C50.9'), true);
    assert.equal(isCancerIcdCode('c18.7'), true);
    assert.equal(isCancerIcdCode('D05.1'), true);
    assert.equal(isCancerIcdCode('D12.6'), false); // benign
    assert.equal(isCancerIcdCode('D48.5'), false); // uncertain behaviour
    assert.equal(isCancerIcdCode('E11.9'), false);
    assert.equal(isCancerIcdCode(null), false);
  });
});

describe('groupByPatient', () => {
  it('groups evidence per patient, strongest and most recent first', () => {
    const groups = groupByPatient([
      { patientId: 'a', sourceType: 'tumor_marker', sourceId: '1', strength: 'low', title: 'CEA', excerpt: '12', matchedTerms: [], resultAt: '2026-11-01' },
      { patientId: 'b', sourceType: 'imaging', sourceId: '2', strength: 'medium', title: 'CT', excerpt: '', matchedTerms: [], resultAt: '2026-10-01' },
      { patientId: 'a', sourceType: 'pathology', sourceId: '3', strength: 'high', title: 'Biopsy', excerpt: '', matchedTerms: [], resultAt: '2026-10-20' },
    ]);
    assert.deepEqual(groups.map((g) => g.patientId), ['a', 'b']);
    assert.equal(groups[0].strength, 'high');
    assert.equal(groups[0].latestResultAt, '2026-11-01');
    assert.deepEqual(groups[0].evidence.map((e) => e.sourceType), ['pathology', 'tumor_marker']);
  });
});

describe('isCandidateSourceType', () => {
  it('accepts known source types only', () => {
    assert.equal(isCandidateSourceType('pathology'), true);
    assert.equal(isCandidateSourceType('note'), false);
  });
});
