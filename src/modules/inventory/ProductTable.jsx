import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import EditProductDialog from "./EditProductDialog";
export default function ProductTable({ products }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
<TableHead>Category</TableHead>
<TableHead>Company</TableHead>
<TableHead>Price</TableHead>
<TableHead>Stock</TableHead>
<TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
  {products.length === 0 ? (
    <TableRow>
      <TableCell colSpan={6} className="text-center">
        No products found.
      </TableCell>
    </TableRow>
  ) : (
    products.map((product) => (
      <TableRow key={product.id}>
        <TableCell>{product.name}</TableCell>
        <TableCell>{product.categories?.name}</TableCell>
        <TableCell>{product.companies?.name}</TableCell>
        <TableCell>R {product.price}</TableCell>
        <TableCell>{product.stock}</TableCell>

<TableCell>
  <EditProductDialog
    product={product}
    onProductUpdated={() => window.location.reload()}
  />
</TableCell>
      </TableRow>
    ))
  )}
      </TableBody>
    </Table>
  );
}