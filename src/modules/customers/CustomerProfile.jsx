import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import DashboardLayout from "@/layouts/DashboardLayout";
import { supabase } from "@/services/supabase";

export default function CustomerProfile() {
  const { id } = useParams();

  const [customer, setCustomer] = useState(null);
  const [sales, setSales] = useState([]);

  useEffect(() => {
    loadCustomer();
  }, []);

 async function loadCustomer() {

  console.log("Customer ID from URL:", id);

  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .single();

  console.log("Customer Data:", data);
  console.log("Customer Error:", error);

  setCustomer(data);

  const { data: salesData, error: salesError } =
    await supabase
      .from("sales")
      .select("*")
      .eq("customer_id", id);

  console.log("Sales Data:", salesData);
  console.log("Sales Error:", salesError);

  setSales(salesData || []);
}

    
  if (!customer) {
    return (
      <DashboardLayout>
        Loading...
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>

      <div className="space-y-6">

        <div className="bg-white rounded-xl shadow p-6">

          <h1 className="text-3xl font-bold">
            {customer.name}
          </h1>

          <p>{customer.email}</p>

          <p>{customer.phone}</p>

          <p>{customer.address}</p>

        </div>

      </div>

    </DashboardLayout>
  );
}