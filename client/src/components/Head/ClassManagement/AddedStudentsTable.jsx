// const AddedStudentsTable = ({ students }) => (
//   <div>
//     <h3>Students Added to Class</h3>
//     <table>
//       <thead>
//         <tr>
//           <th>Name</th>
//           <th>Actions</th>
//         </tr>
//       </thead>
//       <tbody>
//         {students.map((student) => (
//           <tr key={student._id}>
//             <td>{student.name}</td>
//             <td>
//               <button onClick={() => removeStudent(student._id)}>Remove</button>
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   </div>
// );