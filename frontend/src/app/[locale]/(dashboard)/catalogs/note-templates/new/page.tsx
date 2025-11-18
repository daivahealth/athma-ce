'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useCreateNoteTemplate } from '@/modules/foundation/hooks/use-catalogs';
import { TemplateStatus } from '@/modules/foundation/types/catalog';

const EMPTY_SCHEMA = JSON.stringify({ sections: [] }, null, 2);

export default function CreateNoteTemplatePage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const toast = useToast();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [specialtyId, setSpecialtyId] = useState('');
  const [status, setStatus] = useState<TemplateStatus>(TemplateStatus.ACTIVE);
  const [schemaInput, setSchemaInput] = useState(EMPTY_SCHEMA);
  const [changeLog, setChangeLog] = useState('Initial version');
  const [schemaError, setSchemaError] = useState<string | null>(null);

  const { mutateAsync: createTemplate, isPending } = useCreateNoteTemplate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSchemaError(null);

    try {
      const schema = JSON.parse(schemaInput || '{}');
      const payload = {
        name: name.trim(),
        description: description.trim() || undefined,
        specialtyId: specialtyId.trim() || undefined,
        status,
        schema,
        changeLog: changeLog.trim() || undefined,
      };

      if (!payload.name) {
        toast({ variant: 'destructive', title: 'Name required', description: 'Please provide a template name.' });
        return;
      }

      await createTemplate(payload);
      toast({ title: 'Template created', description: `${payload.name} is now available.` });
      router.push(`/${locale}/catalogs/note-templates`);
    } catch (error) {
      if (error instanceof SyntaxError) {
        setSchemaError('Schema must be valid JSON.');
        return;
      }
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Unable to create template',
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    }
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/${locale}/catalogs/note-templates`}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to templates
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Create note template</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="template-name">Template name</Label>
                <Input
                  id="template-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g., SOAP Note"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialty-id">Specialty (optional)</Label>
                <Input
                  id="specialty-id"
                  value={specialtyId}
                  onChange={(event) => setSpecialtyId(event.target.value)}
                  placeholder="Specialty ID"
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={(value) => setStatus(value as TemplateStatus)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={TemplateStatus.ACTIVE}>Active</SelectItem>
                    <SelectItem value={TemplateStatus.INACTIVE}>Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="change-log">Change log</Label>
                <Input
                  id="change-log"
                  value={changeLog}
                  onChange={(event) => setChangeLog(event.target.value)}
                  placeholder="Describe this version"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Short summary for catalog users"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="schema">Schema JSON</Label>
              <Textarea
                id="schema"
                value={schemaInput}
                onChange={(event) => setSchemaInput(event.target.value)}
                className="font-mono"
                rows={12}
              />
              {schemaError && <p className="text-sm text-destructive">{schemaError}</p>}
              <p className="text-xs text-muted-foreground">
                Provide the structured template definition (sections, fields, defaults). Must be valid JSON.
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => router.push(`/${locale}/catalogs/note-templates`)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Creating...' : 'Create template'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
