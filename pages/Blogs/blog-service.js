// import { addDocument } from "./firestore.js";

// export async function createBlog(blog){

//     return await addDocument("blogs",{

//         ...blog,

//         createdAt:new Date(),

//         updatedAt:new Date(),

//         views:0

//     });

// }


// //update blog
// import { updateDocument } from "./firestore.js";

// export async function updateBlog(id,data){

//     return await updateDocument(

//         "blogs",

//         id,

//         {

//             ...data,

//             updatedAt:new Date()

//         }

//     );

// }

// //Get Blog
// import { getDocument } from "./firestore.js";

// export async function getBlog(id){

//     return await getDocument(

//         "blogs",

//         id

//     );

// }

// //Delete Blog
// import { deleteDocument } from "./firestore.js";

// export async function deleteBlog(id){

//     return await deleteDocument(

//         "blogs",

//         id

//     );

// }

// //Auto Generate Slug
// function generateSlug(title){

//     return title

//     .toLowerCase()

//     .trim()

//     .replace(/[^a-z0-9\s-]/g,"")

//     .replace(/\s+/g,"-")

//     .replace(/-+/g,"-");

// }

// //Reading Time
// function calculateReadingTime(html){

//     const words=

//     html.replace(/<[^>]*>/g,"")

//     .trim()

//     .split(/\s+/)

//     .length;

//     return Math.max(

//         1,

//         Math.ceil(words/200)

//     );

// }

// //Word Count
// function wordCount(html){

//     return html

//     .replace(/<[^>]*>/g,"")

//     .trim()

//     .split(/\s+/)

//     .length;

// }

// //