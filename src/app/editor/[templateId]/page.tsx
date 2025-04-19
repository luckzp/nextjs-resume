import TemplateRedirect from "@/components/TemplateRedirect";

export const dynamic = "force-static";

// Generate static params for static exports
export async function generateStaticParams() {
  return [
    { templateId: "theme1" },
    { templateId: "theme2" },
    { templateId: "theme3" },
    { templateId: "theme4" },
  ];
}

export default function Page({ params }: { params: { templateId: string } }) {
  return <TemplateRedirect templateId={params.templateId} />;
}
