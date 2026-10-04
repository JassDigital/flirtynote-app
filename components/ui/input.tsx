export function Input(props: any) {
  return <input {...props} className={`w-full p-2 border rounded-md ${props.className || ''}`} />;
}
