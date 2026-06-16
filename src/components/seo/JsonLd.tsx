// Server Component — injects JSON-LD schema into <head>
// Usage: <JsonLd schema={generateProductSchema(product)} />
// Usage: <JsonLd schema={[schema1, schema2]} /> (multiple schemas)

interface JsonLdProps {
  schema: Record<string, unknown> | Record<string, unknown>[]
}

// Escape characters that could let a string value break out of the surrounding
// <script> tag (e.g. "</script>"). Browsers parse the \uXXXX escapes back to the
// original characters, so the emitted JSON-LD is semantically identical.
function safeJsonLd(value: Record<string, unknown>): string {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
}

export default function JsonLd({ schema }: JsonLdProps) {
  const schemas = Array.isArray(schema) ? schema : [schema]
  return (
    <>
      {schemas.map((s, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(s) }}
        />
      ))}
    </>
  )
}
