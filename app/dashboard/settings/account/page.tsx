// 'use client';

// import { useActionState, startTransition, use } from 'react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// // import { useUser } from '@/lib/auth';
// // import { updateAccount } from '@/app/(login)/actions';

// type ActionState = {
//   error?: string;
//   success?: string;
// };

// const initialState: ActionState = { error: '', success: '' };

// export default function AccountSettingsPage() {
//   const { userPromise } = useUser();
//   const user = use(userPromise);

//   const [state, formAction, isPending] = useActionState<ActionState, FormData>(
//     updateAccount,
//     initialState
//   );

//   const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     startTransition(() => {
//       formAction(new FormData(event.currentTarget));
//     });
//   };

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Account Information</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="space-y-2">
//             <Label htmlFor="name" className="mb-2">Name</Label>
//             <Input 
//               id="name" 
//               name="name" 
//               placeholder="Enter your name" 
//               defaultValue={user?.name || ''} 
//               required 
//             />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="email" className="mb-2">Email</Label>
//             <Input 
//               id="email" 
//               name="email" 
//               type="email" 
//               placeholder="Enter your email" 
//               defaultValue={user?.email || ''} 
//               required 
//             />
//           </div>

//           {state.error && (
//             <p className="text-sm text-red-500">{state.error}</p>
//           )}
//           {state.success && (
//             <p className="text-sm text-green-500">{state.success}</p>
//           )}

//           <div className="flex justify-end">
//             <Button type="submit" disabled={isPending}>
//               {isPending ? 'Saving...' : 'Save Settings'}
//             </Button>
//           </div>
//         </form>
//       </CardContent>
//     </Card>
//   );
// }