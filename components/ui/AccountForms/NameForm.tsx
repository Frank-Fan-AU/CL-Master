'use client';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { updateName } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NameForm({ userName }: { userName: string }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    // Check if the new name is the same as the old name
    if (e.currentTarget.newName.value === userName) {
      e.preventDefault();
      setIsSubmitting(false);
      return;
    }
    handleRequest(e, updateName, router);
    setIsSubmitting(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Name</CardTitle>
        <CardDescription>
          Update your name.
        </CardDescription>
      </CardHeader>
      <form id="nameForm" onSubmit={handleSubmit}>
        <div className="p-6">
          <input
            type="text"
            name="newName"
            className="w-full p-3 rounded-md bg-zinc-800"
            defaultValue={userName ?? ''}
            placeholder="Your name"
            maxLength={64}
          />
        </div>
        <CardFooter>
          <Button
            variant="secondary"
            type="submit"
            form="nameForm"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Loading...' : 'Update Name'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
