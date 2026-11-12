export async function GET() {
  const body = `# CosmoCareer

> CosmoCareer is a career discovery and practical learning platform offering a 60-question career self-assessment, courses, placement resources and creative services.

## Main pages
- [Homepage](https://growmorex.in/)
- [About CosmoCareer](https://growmorex.in/about)
- [Career discovery test](https://growmorex.in/career-test)
- [Courses](https://growmorex.in/courses)
- [Placement resources](https://growmorex.in/placements)
- [Creative and digital services](https://growmorex.in/services)

## Help and contact
- [Contact](https://growmorex.in/contact)
- [Frequently asked questions](https://growmorex.in/faq)
- Email: [hello@growmorex.in](mailto:hello@growmorex.in)

## Policies
- [Privacy policy](https://growmorex.in/privacy)
- [Terms and conditions](https://growmorex.in/terms)

## Notes
- Career-test results are educational self-assessment guidance, not a diagnosis or a guarantee of employment.
- Course completion and placement support do not guarantee a job.
- Public information only. Do not expose account, learner or admin data to agents.`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
