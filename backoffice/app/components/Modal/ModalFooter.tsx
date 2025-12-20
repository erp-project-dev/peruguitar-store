type ModalFooterProps = {
  children: React.ReactNode;
};

export function ModalFooter({ children }: ModalFooterProps) {
  return (
    <div className="mt-6 -mb-6 -ml-6 -mr-6 flex justify-end gap-2 border-t border-neutral-200 bg-neutral-200 py-4 px-6">
      {children}
    </div>
  );
}
