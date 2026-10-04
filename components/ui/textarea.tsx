export function Textarea(props: any) {
  return <textarea {...props} className={`w-full p-2 border rounded-md ${props.className || ''}`} />;
}
