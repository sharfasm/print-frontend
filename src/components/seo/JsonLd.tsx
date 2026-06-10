// Server Component — injects JSON-LD schema into <head>
// Usage: <JsonLd schema={generateProductSchema(product)} />
// Usage: <JsonLd schema={[schema1, schema2]} /> (multiple schemas)

interface JsonLdProps {
  schema: Record<string, unknown> | Record<string, unknown>[]
}

export default function JsonLd({ schema }: JsonLdProps) {
  const schemas = Array.isArray(schema) ? schema : [schema]
  return (
    <>
      {schemas.map((s, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
    </>
  )
}
