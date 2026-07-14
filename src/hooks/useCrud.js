import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
export default function useCrud({
  getItems,
  addItem,
  updateItem,
  deleteItem,
  itemName,
  searchField = "name",
}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);

  const [editingItem, setEditingItem] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);

  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    loadData();
    async function saveItem(item) {
  try {
    
function requestDelete(id) {
  setItemToDelete(id);
  setConfirmOpen(true);
}

async function confirmDelete() {
  if (!itemToDelete) return;

  try {
    await deleteItem(itemToDelete);

    setConfirmOpen(false);
    setItemToDelete(null);

    await loadData();

    toast.success(`${itemName} deleted successfully.`);

  } catch (error) {
    console.error(error);
    toast.error(`Failed to delete ${itemName.toLowerCase()}.`);
  }
}
    const isEditing = !!editingItem;

    if (isEditing) {
      await updateItem(editingItem.id, item);
    } else {
      await addItem(item);
    }

    await loadData();

    toast.success(
      isEditing
        ? `${itemName} updated successfully.`
        : `${itemName} created successfully.`
    );

    setEditingItem(null);
    setDialogOpen(false);

  } catch (error) {
    console.error(error);
    toast.error(`Failed to save ${itemName.toLowerCase()}.`);
  }
}
  }, []);

  async function loadData() {
    try {
      setLoading(true);

      const items = await getItems();

      setData(items || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const filteredData = useMemo(() => {
    return data.filter((item) =>
      String(item[searchField] || "")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [data, search, searchField]);

  return {
    data,
    loading,

    search,
    setSearch,

    dialogOpen,
    setDialogOpen,

    editingItem,
    setEditingItem,

    confirmOpen,
    setConfirmOpen,

    itemToDelete,
    setItemToDelete,

    filteredData,

    loadData,

    saveItem,
requestDelete,
confirmDelete,
  };
}