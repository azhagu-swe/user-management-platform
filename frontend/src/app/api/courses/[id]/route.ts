// // src/app/api/courses/[id]/route.ts
// import { NextResponse } from 'next/server';
// import coursesData from '@/data/courses.json';
// // import type { Course } from '@/types';

// export async function GET(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   const courseId = params.id;
//   const courses = coursesData;
//   const course = courses.find((c) => c.id === courseId);

//   if (!course) {
//     return NextResponse.json({ message: 'Course not found' }, { status: 404 });
//   }
//   // await new Promise(resolve => setTimeout(resolve, 300)); // Optional delay
//   return NextResponse.json(course);
// }
