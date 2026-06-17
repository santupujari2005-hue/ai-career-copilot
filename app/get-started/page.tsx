import { redirect } from 'next/navigation';

export default function GetStartedPage() {
  // Redirect users to the Upload page where they can start their resume flow
  redirect('/upload');
}
