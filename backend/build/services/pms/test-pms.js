"use strict";
// Simple test to verify PMS service structure
const fs = require('fs');
const path = require('path');
console.log('🧪 Testing PMS Service Structure...\n');
// Check if key files exist
const requiredFiles = [
    'src/index.ts',
    'src/app.module.ts',
    'src/modules/patient/patient.module.ts',
    'src/modules/patient/patient.controller.ts',
    'src/modules/patient/patient.service.ts',
    'src/modules/patient/patient.repository.ts',
    'src/modules/patient/dto/patient.dto.ts',
    'src/modules/appointment/appointment.module.ts',
    'src/modules/appointment/appointment.controller.ts',
    'src/modules/appointment/appointment.service.ts',
    'src/modules/appointment/appointment.repository.ts',
    'src/modules/appointment/dto/appointment.dto.ts',
    'src/modules/encounter/encounter.module.ts',
    'src/modules/encounter/encounter.controller.ts',
    'src/modules/encounter/encounter.service.ts',
    'src/modules/encounter/encounter.repository.ts',
    'src/modules/encounter/dto/encounter.dto.ts',
    'src/modules/staff/staff.module.ts',
    'src/modules/staff/staff.controller.ts',
    'src/modules/staff/staff.service.ts',
    'src/modules/staff/staff.repository.ts',
    'src/modules/facility/facility.module.ts',
    'src/modules/facility/facility.controller.ts',
    'src/modules/facility/facility.service.ts',
    'src/modules/facility/facility.repository.ts',
    'src/modules/clinical/clinical.module.ts',
    'src/modules/clinical/clinical.controller.ts',
    'src/modules/clinical/clinical.service.ts',
    'src/shared/database.module.ts',
    'package.json',
];
let allFilesExist = true;
let existingFiles = 0;
console.log('📁 Checking required files:');
requiredFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    const exists = fs.existsSync(filePath);
    console.log(`${exists ? '✅' : '❌'} ${file}`);
    if (exists)
        existingFiles++;
    if (!exists)
        allFilesExist = false;
});
console.log(`\n📊 Summary: ${existingFiles}/${requiredFiles.length} files exist`);
if (allFilesExist) {
    console.log('🎉 All required files are present!');
    // Check package.json structure
    try {
        const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
        console.log('\n📦 Package.json structure:');
        console.log(`✅ Name: ${packageJson.name}`);
        console.log(`✅ Version: ${packageJson.version}`);
        console.log(`✅ Main: ${packageJson.main}`);
        console.log(`✅ Scripts: ${Object.keys(packageJson.scripts || {}).length} scripts defined`);
        console.log(`✅ Dependencies: ${Object.keys(packageJson.dependencies || {}).length} dependencies`);
        console.log(`✅ Dev Dependencies: ${Object.keys(packageJson.devDependencies || {}).length} dev dependencies`);
    }
    catch (error) {
        console.log('❌ Error reading package.json:', error.message);
    }
}
else {
    console.log('❌ Some required files are missing!');
    process.exit(1);
}
console.log('\n🚀 PMS Service structure validation complete!');
//# sourceMappingURL=test-pms.js.map