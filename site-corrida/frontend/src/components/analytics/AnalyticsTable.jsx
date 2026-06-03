export default function AnalyticsTable({ title, data }) {
  return (
    <div
      className="
        bg-white
        rounded-2xl
        shadow-md
        overflow-hidden
      "
    >
      <div
        className="
          px-5
          py-4
          border-b
          bg-gradient-to-r
          from-purple-600
          to-pink-600
          text-white
        "
      >
        <h3
          className="
            text-lg
            font-bold
          "
        >
          {title}
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th
                className="
                  text-left
                  px-4
                  py-3
                  font-semibold
                  text-gray-700
                "
              >
                Item
              </th>

              <th
                className="
                  text-right
                  px-4
                  py-3
                  font-semibold
                  text-gray-700
                "
              >
                Quantidade
              </th>
            </tr>
          </thead>

          <tbody>
            {Object.entries(data).map(([key, value]) => (
              <tr
                key={key}
                className="
                      border-b
                      hover:bg-purple-50
                    "
              >
                <td
                  className="
                        px-4
                        py-3
                        text-gray-700
                      "
                >
                  {key}
                </td>

                <td
                  className="
                        px-4
                        py-3
                        text-right
                        font-bold
                        text-purple-700
                      "
                >
                  {value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// import PropTypes from "prop-types";

// export default function AnalyticsTable({ title = "Analytics", data = {} }) {
//   const listaItens =
//     !data || typeof data !== "object" || Array.isArray(data)
//       ? []
//       : Object.entries(data).map(([key, value]) => {
//           const itemFormatado = key
//             .replace(/([A-Z])/g, " $1")
//             .replace(/[_-]/g, " ")
//             .trim();

//           const itemFinal =
//             itemFormatado.charAt(0).toUpperCase() + itemFormatado.slice(1);

//           return {
//             id: key,

//             item: itemFinal || "-",

//             quantidade: typeof value === "number" ? value : String(value || 0),
//           };
//         });

//   return (
//     <div
//       className="
//       bg-white
//       rounded-lg
//       shadow
//       overflow-hidden
//       w-full
//     "
//     >
//       <div
//         className="
//         bg-gradient-to-r
//         from-pink-500
//         to-purple-500
//         text-white
//         px-4
//         py-3
//         font-bold
//       "
//       >
//         {title}
//       </div>

//       <div
//         className="
//         overflow-x-auto
//         w-full
//       "
//       >
//         <table
//           className="
//           w-full
//           min-w-[300px]
//           border-collapse
//         "
//         >
//           <thead
//             className="
//             bg-gray-100
//           "
//           >
//             <tr>
//               <th
//                 className="
//                 px-4
//                 py-3
//                 text-left
//                 text-xs
//                 font-semibold
//                 text-gray-600
//                 uppercase
//               "
//               >
//                 Item
//               </th>

//               <th
//                 className="
//                 px-4
//                 py-3
//                 text-center
//                 text-xs
//                 font-semibold
//                 text-gray-600
//                 uppercase
//               "
//               >
//                 Quantidade
//               </th>
//             </tr>
//           </thead>

//           <tbody
//             className="
//             divide-y
//             divide-gray-100
//           "
//           >
//             {listaItens.length > 0 ? (
//               listaItens.map(({ id, item, quantidade }) => (
//                 <tr
//                   key={id}
//                   className="
//                       hover:bg-gray-50
//                       transition-colors
//                     "
//                 >
//                   <td
//                     className="
//                       px-4
//                       py-3
//                       text-sm
//                       text-gray-700
//                     "
//                   >
//                     {item}
//                   </td>

//                   <td
//                     className="
//                       px-4
//                       py-3
//                       text-sm
//                       text-center
//                       font-semibold
//                       text-gray-900
//                     "
//                   >
//                     {quantidade}
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td
//                   colSpan="2"
//                   className="
//                     px-4
//                     py-8
//                     text-center
//                     text-sm
//                     text-gray-400
//                     italic
//                   "
//                 >
//                   Nenhum registro encontrado.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// AnalyticsTable.propTypes = {
//   title: PropTypes.string,

//   data: PropTypes.objectOf(
//     PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//   ),
// };
