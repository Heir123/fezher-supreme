import { useParams } from "react-router-dom";

export default function PurchaseView() {
  const { id } = useParams();

  return (
    <div className="space-y-6">

      <h1 className="text-3xl font-bold">
        Purchase Order
      </h1>

      <div className="bg-white rounded-xl shadow p-6">

        <p className="text-gray-500">
          Purchase ID:
        </p>

        <p className="font-bold">
          {id}
        </p>

      </div>

    </div>
  );
}