export default function TaggedPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center space-y-3">
      <div className="icon tagged" />
      <span className="font-bold text-3xl leading-9">Photos of you</span>
      <span className="text-sm">
        When people tag you in photos, they&apos;ll appear here.
      </span>
    </div>
  );
}
