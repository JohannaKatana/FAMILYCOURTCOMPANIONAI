type Props = { children: React.ReactNode; attribution?: string };

export function QuoteBlock({ children, attribution }: Props) {
  return (
    <figure className="my-3">
      <blockquote className="border-l-3 border-primary pl-4 py-1">
        <p className="text-sm italic text-muted-foreground leading-relaxed">"{children}"</p>
      </blockquote>
      {attribution && (
        <figcaption className="mt-1 text-xs text-muted-foreground pl-4">— {attribution}</figcaption>
      )}
    </figure>
  );
}
