'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, ClipboardList, TestTube, Target, Timer, Dumbbell, Smartphone } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const wellnessModules = [
  {
    href: '/wellness/assessments',
    icon: ClipboardList,
    titleKey: 'nav.wellnessAssessments',
    description: 'Create and manage wellness assessments with scoring',
  },
  {
    href: '/wellness/biomarkers',
    icon: TestTube,
    titleKey: 'nav.biomarkers',
    description: 'Track biomarkers, trends, and alerts',
  },
  {
    href: '/wellness/programs',
    icon: Target,
    titleKey: 'nav.wellnessPrograms',
    description: 'Enroll patients in multi-session wellness programs',
  },
  {
    href: '/wellness/longevity',
    icon: Timer,
    titleKey: 'nav.longevity',
    description: 'Longevity protocols and biological age tracking',
  },
  {
    href: '/wellness/lifestyle',
    icon: Dumbbell,
    titleKey: 'nav.lifestyle',
    description: 'Nutrition plans and exercise prescriptions',
  },
  {
    href: '/wellness/devices',
    icon: Smartphone,
    titleKey: 'nav.devices',
    description: 'Connect wearables and sync health data',
  },
];

export default function WellnessDashboardPage() {
  const t = useTranslations();
  const params = useParams();
  const locale = params.locale as string;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Heart className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">{t('nav.wellnessDashboard')}</h1>
          <p className="text-muted-foreground">
            Comprehensive wellness and longevity management
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {wellnessModules.map((module) => {
          const Icon = module.icon;
          return (
            <Link key={module.href} href={`/${locale}${module.href}`}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{t(module.titleKey)}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{module.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
