export function downloadBlob(args: { blob: Blob; name: string }) {
  const link = document.createElement('a');
  const url = URL.createObjectURL(args.blob);
  link.href = url;
  link.download = args.name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
