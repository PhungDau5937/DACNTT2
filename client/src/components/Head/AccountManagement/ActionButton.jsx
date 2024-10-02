import React from 'react'

const ActionButton = ({ onClick, text, colorClass }) => (
  <button
    onClick={onClick}
    className={`px-4 py-1 ${colorClass}  text-white bg-stone-500 rounded-md hover:bg-black`}
  >
    {text}
  </button>
);
export default ActionButton
