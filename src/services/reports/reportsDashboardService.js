import { supabase } from "../supabase";

export async function getReportsDashboard() {

    const [

        executive,

        sales,

        inventory,

        finance,

        customers,

        employees

    ] = await Promise.all([

        supabase
            .from("vw_executive_dashboard")
            .select("*")
            .single(),

        supabase
            .from("vw_sales_summary")
            .select("*")
            .single(),

        supabase
            .from("vw_inventory_summary")
            .select("*")
            .single(),

        supabase
            .from("vw_finance_summary")
            .select("*")
            .single(),

        supabase
            .from("vw_customer_summary")
            .select("*")
            .single(),

        supabase
            .from("vw_employee_summary")
            .select("*")
            .single()

    ]);

    return {

        executive: executive.data,

        sales: sales.data,

        inventory: inventory.data,

        finance: finance.data,

        customers: customers.data,

        employees: employees.data

    };

}