export function calculateBusinessHealth(data) {

    let sales = 50;
    let finance = 50;
    let inventory = 50;
    let crm = 50;
    let hr = 50;

    // ------------------------
    // SALES
    // ------------------------

    if ((data.revenue || 0) > 0)
        sales += 25;

    if ((data.totalSales || 0) > 0)
        sales += 25;

    // ------------------------
    // FINANCE
    // ------------------------

    if ((data.profit || 0) > 0)
        finance += 30;

    if ((data.expenses || 0) < (data.revenue || 0))
        finance += 20;

    // ------------------------
    // INVENTORY
    // ------------------------

    if ((data.lowStock || 0) === 0)
        inventory += 30;

    if ((data.inventoryValue || 0) > 0)
        inventory += 20;

    // ------------------------
    // CRM
    // ------------------------

    if ((data.customers || 0) > 0)
        crm += 25;

    if ((data.totalSales || 0) > 0)
        crm += 25;

    // ------------------------
    // HR
    // ------------------------

    if ((data.activeEmployees || 0) > 0)
        hr += 30;

    if ((data.employees || 0) > 0)
        hr += 20;

    sales = Math.min(sales, 100);
    finance = Math.min(finance, 100);
    inventory = Math.min(inventory, 100);
    crm = Math.min(crm, 100);
    hr = Math.min(hr, 100);

    const overall = Math.round(
        (sales + finance + inventory + crm + hr) / 5
    );

    return {
        overall,
        sales,
        finance,
        inventory,
        crm,
        hr
    };

}