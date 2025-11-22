'use client';

import { ApiReferenceReact } from '@scalar/api-reference-react';
import '@scalar/api-reference-react/style.css';

export default function OpenApiDocsPage() {
  return (
    <ApiReferenceReact
      configuration={{
        spec: {
          url: '/api/openapi.json',
        },
      }}
    />
  );
}
