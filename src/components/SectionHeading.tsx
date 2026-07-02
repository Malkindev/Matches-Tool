interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
}

function SectionHeading({ eyebrow, title, description, align = 'left' }: SectionHeadingProps) {
  const alignment = align === 'center' ? 'items-center text-center' : 'items-start text-left';

  return (
    <div className={`flex flex-col gap-3 ${alignment}`}>
      <p className="text-sm font-medium uppercase tracking-[0.3em] text-sky-300/80">{eyebrow}</p>
      <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        {title}
      </h2>
      {description ? <p className="max-w-2xl text-base leading-7 text-slate-300">{description}</p> : null}
    </div>
  );
}

export default SectionHeading;
