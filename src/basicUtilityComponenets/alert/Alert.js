export default function Alert({ message, type, handleMessageClear }) {
  return (
    <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50">
      {type === "error" && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-9 py-3 rounded relative shadow-lg" role="alert">
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{message}</span>
          <button onClick={handleMessageClear} className="absolute top-0 bottom-0 right-0 px-4 py-3">
            <svg className="fill-current h-6 w-6 text-red-500  " role="button" viewBox="0 0 20 20">
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 01-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 11-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 111.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 111.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 010 1.698z" />
            </svg>
          </button>
        </div>
      )}

      {type === "success" && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-9 py-3 rounded relative shadow-lg" role="alert">
          <strong className="font-bold">Success! </strong>
          <span className="block sm:inline">{message}</span>
          <button onClick={handleMessageClear} className="absolute top-0 bottom-0 right-0 px-4 py-3">
            <svg className="fill-current h-6 w-6 text-green-500" role="button" viewBox="0 0 20 20">
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 01-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 11-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 111.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 111.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 010 1.698z" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
