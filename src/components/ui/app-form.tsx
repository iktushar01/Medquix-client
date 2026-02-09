"use client";

type AppFormProps = {
  onSubmit: () => void;
  children: React.ReactNode;
};

export default function AppForm({ onSubmit, children }: AppFormProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-4"
    >
      {children}
    </form>
  );
}
