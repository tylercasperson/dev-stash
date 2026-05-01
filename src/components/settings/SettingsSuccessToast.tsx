'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function SettingsSuccessToast() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      toast.success('Welcome to DevStash Pro!');
      router.replace('/settings');
    }
  }, [searchParams, router]);

  return null;
}
