import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingCart, Boxes, Users, CreditCard, BarChart3, MessageSquare, Settings, Truck, Undo2, Home, Plus } from "lucide-react";

const STORAGE_KEY = "nexus-erp-mvp";

const seed = {
  products: [
    { id: crypto.randomUUID(), sku: "AV-001", name: "Sutiã Renda Essencial", category: "Lingerie", cost: 39.9, price: 89.9, stock: 12, minStock: 4 },
    { id: crypto.randomUUID(), sku: "AV-002", name: "Calcinha Soft Premium", category: "Lingerie", cost: 19.9, price: 44.9, stock: 20, minStock: 6 },
    { id: crypto.randomUUID(), sku: "AV-003", name: "Colar Ponto de Luz", category: "Joias", cost: 120, price: 249.9, stock: 5, minStock: 2 },
  ],
  customers: [
    { id: crypto.randomUUID(), name: "Consumidor Final", phone: "", city: "Manaus", creditLimit: 0, status: "Ativo" },
    { id: crypto.randomUUID(), name: "Maria Oliveira", phone: "(92) 99999-0001", city: "Manaus", creditLimit: 300, status: "Ativo" },
  ],
  sales: [],
  purchases: [],
  returns: [],
  receivables: [],
  payables: [],
  users: [{ id: crypto.randomUUID(), name: "Administrador", email: "admin@nexus.local", role: "Administrador", status: "Ativo" }],
  chatThreads: [
    { id: crypto.randomUUID(), title: "Equipe Loja", messages: [{ id: crypto.randomUUID(), sender: "Administrador", text: "Bom dia, time. Bora vender com método.", at: new Date().toISOString() }] },
  ],
};

function brl(value) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value || 0));
}
function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : seed;
  } catch {
    return seed;
  }
}

export default function App() {
  const [db, setDb] = useState(seed);
  const [tab, setTab] = useState("dashboard");
  const [productModal, setProductModal] = useState(false);
  const [customerModal, setCustomerModal] = useState(false);
  const [purchaseModal, setPurchaseModal] = useState(false);
  const [returnModal, setReturnModal] = useState(false);
  const [receivableModal, setReceivableModal] = useState(false);
  const [payableModal, setPayableModal] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [selectedThreadId, setSelectedThreadId] = useState("");
  const [cart, setCart] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("PIX");

  const [productForm, setProductForm] = useState({ sku: "", name: "", category: "Lingerie", cost: "", price: "", stock: "", minStock: "" });
  const [customerForm, setCustomerForm] = useState({ name: "", phone: "", city: "Manaus", creditLimit: "", status: "Ativo" });
  const [purchaseForm, setPurchaseForm] = useState({ productId: "", qty: "", unitCost: "" });
  const [returnForm, setReturnForm] = useState({ saleId: "", productId: "", qty: "", reason: "" });
  const [receivableForm, setReceivableForm] = useState({ description: "", customerId: "", amount: "", dueDate: todayISO() });
  const [payableForm, setPayableForm] = useState({ description: "", supplier: "", amount: "", dueDate: todayISO() });

  useEffect(() => { setDb(loadData()); }, []);
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(db)); }, [db]);
  useEffect(() => {
    if (!selectedThreadId && db.chatThreads[0]) setSelectedThreadId(db.chatThreads[0].id);
  }, [db.chatThreads, selectedThreadId]);

  const metrics = useMemo(() => {
    const revenue = db.sales.reduce((s, i) => s + i.total, 0);
    const lowStock = db.products.filter((p) => p.stock <= p.minStock).length;
    const openReceivables = db.receivables.filter((r) => r.status === "Aberto").reduce((s, i) => s + i.amount, 0);
    const openPayables = db.payables.filter((r) => r.status === "Aberto").reduce((s, i) => s + i.amount, 0);
    return { revenue, lowStock, openReceivables, openPayables };
  }, [db]);

  const activeThread = db.chatThreads.find((t) => t.id === selectedThreadId);

  function customerName(id) {
    return db.customers.find((c) => c.id === id)?.name || "Consumidor Final";
  }
  function productName(id) {
    return db.products.find((p) => p.id === id)?.name || "Produto";
  }

  function addProduct() {
    if (!productForm.name || !productForm.sku) return;
    setDb((prev) => ({
      ...prev,
      products: [{ id: crypto.randomUUID(), ...productForm, cost: Number(productForm.cost||0), price: Number(productForm.price||0), stock: Number(productForm.stock||0), minStock: Number(productForm.minStock||0) }, ...prev.products],
    }));
    setProductForm({ sku: "", name: "", category: "Lingerie", cost: "", price: "", stock: "", minStock: "" });
    setProductModal(false);
  }

  function addCustomer() {
    if (!customerForm.name) return;
    setDb((prev) => ({
      ...prev,
      customers: [{ id: crypto.randomUUID(), ...customerForm, creditLimit: Number(customerForm.creditLimit || 0) }, ...prev.customers],
    }));
    setCustomerForm({ name: "", phone: "", city: "Manaus", creditLimit: "", status: "Ativo" });
    setCustomerModal(false);
  }

  function addPurchase() {
    if (!purchaseForm.productId || !purchaseForm.qty || !purchaseForm.unitCost) return;
    const qty = Number(purchaseForm.qty);
    const unitCost = Number(purchaseForm.unitCost);
    const product = db.products.find((p) => p.id === purchaseForm.productId);
    setDb((prev) => ({
      ...prev,
      purchases: [{ id: crypto.randomUUID(), date: todayISO(), productId: purchaseForm.productId, qty, unitCost, total: qty * unitCost }, ...prev.purchases],
      products: prev.products.map((p) => p.id === purchaseForm.productId ? { ...p, stock: p.stock + qty, cost: unitCost } : p),
      payables: [{ id: crypto.randomUUID(), description: `Compra ${product?.name || "Produto"}`, supplier: "Fornecedor", amount: qty * unitCost, dueDate: todayISO(), status: "Aberto" }, ...prev.payables],
    }));
    setPurchaseForm({ productId: "", qty: "", unitCost: "" });
    setPurchaseModal(false);
  }

  function addReturn() {
    if (!returnForm.saleId || !returnForm.productId || !returnForm.qty) return;
    const sale = db.sales.find((s) => s.id === returnForm.saleId);
    const soldItem = sale?.items.find((i) => i.productId === returnForm.productId);
    const qty = Number(returnForm.qty);
    const unit = soldItem?.price || 0;
    setDb((prev) => ({
      ...prev,
      returns: [{ id: crypto.randomUUID(), date: todayISO(), saleId: returnForm.saleId, productId: returnForm.productId, qty, reason: returnForm.reason, total: qty * unit }, ...prev.returns],
      products: prev.products.map((p) => p.id === returnForm.productId ? { ...p, stock: p.stock + qty } : p),
    }));
    setReturnForm({ saleId: "", productId: "", qty: "", reason: "" });
    setReturnModal(false);
  }

  function addReceivable() {
    if (!receivableForm.description || !receivableForm.amount) return;
    setDb((prev) => ({
      ...prev,
      receivables: [{ id: crypto.randomUUID(), ...receivableForm, amount: Number(receivableForm.amount), status: "Aberto" }, ...prev.receivables],
    }));
    setReceivableForm({ description: "", customerId: "", amount: "", dueDate: todayISO() });
    setReceivableModal(false);
  }

  function addPayable() {
    if (!payableForm.description || !payableForm.amount) return;
    setDb((prev) => ({
      ...prev,
      payables: [{ id: crypto.randomUUID(), ...payableForm, amount: Number(payableForm.amount), status: "Aberto" }, ...prev.payables],
    }));
    setPayableForm({ description: "", supplier: "", amount: "", dueDate: todayISO() });
    setPayableModal(false);
  }

  function addToCart(product) {
    if (product.stock <= 0) return;
    setCart((prev) => {
      const found = prev.find((i) => i.productId === product.id);
      if (found) return prev.map((i) => i.productId === product.id ? { ...i, qty: Math.min(i.qty + 1, product.stock) } : i);
      return [...prev, { productId: product.id, name: product.name, price: product.price, qty: 1 }];
    });
  }

  function updateQty(productId, delta) {
    setCart((prev) => prev.map((i) => i.productId === productId ? { ...i, qty: i.qty + delta } : i).filter((i) => i.qty > 0));
  }

  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  function finalizeSale() {
    if (!cart.length) return;
    setDb((prev) => {
      const sale = { id: crypto.randomUUID(), number: prev.sales.length + 1, date: todayISO(), customerId: customerId || null, paymentMethod, items: cart, total: cartTotal };
      return {
        ...prev,
        sales: [sale, ...prev.sales],
        products: prev.products.map((product) => {
          const item = cart.find((c) => c.productId === product.id);
          return item ? { ...product, stock: Math.max(0, product.stock - item.qty) } : product;
        }),
        receivables: paymentMethod === "Fiado"
          ? [{ id: crypto.randomUUID(), description: `Venda #${sale.number}`, customerId: customerId || null, amount: cartTotal, dueDate: todayISO(), status: "Aberto" }, ...prev.receivables]
          : prev.receivables,
      };
    });
    setCart([]);
    setCustomerId("");
    setPaymentMethod("PIX");
    setTab("sales");
  }

  function markPaid(type, id) {
    setDb((prev) => ({ ...prev, [type]: prev[type].map((i) => i.id === id ? { ...i, status: "Pago" } : i) }));
  }

  function sendChatMessage() {
    if (!chatMessage.trim() || !activeThread) return;
    setDb((prev) => ({
      ...prev,
      chatThreads: prev.chatThreads.map((thread) => thread.id === activeThread.id
        ? { ...thread, messages: [...thread.messages, { id: crypto.randomUUID(), sender: "Administrador", text: chatMessage.trim(), at: new Date().toISOString() }] }
        : thread),
    }));
    setChatMessage("");
  }

  const navItems = [
    { key: "dashboard", label: "Dashboard", icon: Home },
    { key: "products", label: "Produtos", icon: Boxes },
    { key: "pdv", label: "PDV", icon: ShoppingCart },
    { key: "sales", label: "Vendas", icon: ShoppingCart },
    { key: "purchases", label: "Compras", icon: Truck },
    { key: "returns", label: "Devoluções", icon: Undo2 },
    { key: "customers", label: "Clientes", icon: Users },
    { key: "finance", label: "Financeiro", icon: CreditCard },
    { key: "reports", label: "Relatórios", icon: BarChart3 },
    { key: "chat", label: "Mensagens", icon: MessageSquare },
    { key: "admin", label: "Admin", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="w-[88px] bg-white border-r border-slate-200 flex flex-col items-center py-4 gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl">#</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = tab === item.key;
            return (
              <button key={item.key} onClick={() => setTab(item.key)} className={`w-12 h-12 rounded-xl flex items-center justify-center ${active ? "bg-blue-50 text-blue-600" : "text-slate-400 hover:bg-slate-100"}`} title={item.label}>
                <Icon className="w-5 h-5" />
              </button>
            );
          })}
        </aside>

        <main className="flex-1 p-6">
          <div className="max-w-[1400px] mx-auto space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Nexus ERP</h1>
                  <p className="text-sm text-slate-500 mt-1">MVP publicável para Vercel</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setTab("reports")}>Relatórios</Button>
                  <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setTab("pdv")}>Abrir PDV</Button>
                </div>
              </div>

              <div className="p-6">
                <Tabs value={tab} onValueChange={setTab}>
                  <TabsList className="hidden">
                    {navItems.map((n) => <TabsTrigger key={n.key} value={n.key}>{n.label}</TabsTrigger>)}
                  </TabsList>

                  <TabsContent value="dashboard" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                      {[
                        { title: "Faturamento", value: brl(metrics.revenue), hint: "Venda acumulada" },
                        { title: "Estoque crítico", value: metrics.lowStock, hint: "Produtos em alerta" },
                        { title: "A receber", value: brl(metrics.openReceivables), hint: "Títulos em aberto" },
                        { title: "A pagar", value: brl(metrics.openPayables), hint: "Contas em aberto" },
                      ].map((item) => (
                        <motion.div key={item.title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                          <Card className="rounded-2xl shadow-sm">
                            <CardContent className="p-5">
                              <p className="text-xs uppercase tracking-wide text-slate-500">{item.title}</p>
                              <p className="text-3xl font-bold mt-2">{item.value}</p>
                              <p className="text-sm text-slate-400 mt-2">{item.hint}</p>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                      <Card className="rounded-2xl xl:col-span-2">
                        <CardHeader><CardTitle>Últimas Vendas</CardTitle></CardHeader>
                        <CardContent className="p-0">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Nº</TableHead>
                                <TableHead>Data</TableHead>
                                <TableHead>Cliente</TableHead>
                                <TableHead>Total</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {db.sales.length === 0 ? (
                                <TableRow><TableCell colSpan={4} className="text-center text-slate-400 py-8">Sem vendas ainda.</TableCell></TableRow>
                              ) : db.sales.slice(0, 5).map((sale) => (
                                <TableRow key={sale.id}>
                                  <TableCell>#{sale.number}</TableCell>
                                  <TableCell>{sale.date}</TableCell>
                                  <TableCell>{customerName(sale.customerId)}</TableCell>
                                  <TableCell>{brl(sale.total)}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>

                      <Card className="rounded-2xl">
                        <CardHeader><CardTitle>Alertas</CardTitle></CardHeader>
                        <CardContent className="space-y-3">
                          <div className="rounded-xl border p-4">Produtos com estoque crítico: <strong>{metrics.lowStock}</strong></div>
                          <div className="rounded-xl border p-4">Clientes cadastrados: <strong>{db.customers.length}</strong></div>
                          <div className="rounded-xl border p-4">Vendas registradas: <strong>{db.sales.length}</strong></div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="products" className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <div><h2 className="text-2xl font-semibold">Produtos</h2><p className="text-sm text-slate-500">Cadastro e posição de estoque</p></div>
                      <Button onClick={() => setProductModal(true)} className="bg-blue-600 hover:bg-blue-700"><Plus className="w-4 h-4 mr-2" />Produto</Button>
                    </div>
                    <Card className="rounded-2xl overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>SKU</TableHead>
                            <TableHead>Produto</TableHead>
                            <TableHead>Categoria</TableHead>
                            <TableHead>Custo</TableHead>
                            <TableHead>Venda</TableHead>
                            <TableHead>Estoque</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {db.products.map((p) => (
                            <TableRow key={p.id}>
                              <TableCell>{p.sku}</TableCell>
                              <TableCell>{p.name}</TableCell>
                              <TableCell>{p.category}</TableCell>
                              <TableCell>{brl(p.cost)}</TableCell>
                              <TableCell>{brl(p.price)}</TableCell>
                              <TableCell><Badge variant={p.stock <= p.minStock ? "destructive" : "secondary"}>{p.stock}</Badge></TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Card>
                  </TabsContent>

                  <TabsContent value="pdv" className="space-y-4">
                    <div><h2 className="text-2xl font-semibold">PDV</h2><p className="text-sm text-slate-500">Venda rápida com baixa de estoque</p></div>
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                      <Card className="xl:col-span-2 rounded-2xl">
                        <CardHeader><CardTitle>Produtos disponíveis</CardTitle></CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {db.products.map((p) => (
                              <button key={p.id} onClick={() => addToCart(p)} disabled={p.stock <= 0} className="text-left border rounded-2xl p-4 hover:shadow-md transition bg-white disabled:opacity-50">
                                <div className="flex items-start justify-between gap-3">
                                  <div><p className="font-medium">{p.name}</p><p className="text-sm text-slate-500">{p.sku} · {p.category}</p></div>
                                  <Badge variant={p.stock <= p.minStock ? "destructive" : "secondary"}>{p.stock}</Badge>
                                </div>
                                <p className="mt-4 text-lg font-semibold">{brl(p.price)}</p>
                              </button>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="rounded-2xl">
                        <CardHeader><CardTitle>Carrinho</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-3">
                            {cart.length === 0 ? <p className="text-sm text-slate-500">Carrinho vazio.</p> : cart.map((item) => (
                              <div key={item.productId} className="border rounded-2xl p-3">
                                <div className="flex items-center justify-between gap-2">
                                  <div><p className="font-medium text-sm">{item.name}</p><p className="text-xs text-slate-500">{brl(item.price)}</p></div>
                                  <p className="font-semibold">{brl(item.price * item.qty)}</p>
                                </div>
                                <div className="flex items-center gap-2 mt-3">
                                  <Button variant="outline" size="sm" onClick={() => updateQty(item.productId, -1)}>-</Button>
                                  <span className="min-w-6 text-center text-sm">{item.qty}</span>
                                  <Button variant="outline" size="sm" onClick={() => updateQty(item.productId, 1)}>+</Button>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="space-y-3">
                            <div>
                              <Label>Cliente</Label>
                              <Select value={customerId} onValueChange={setCustomerId}>
                                <SelectContent>
                                  <SelectItem value="">Consumidor Final</SelectItem>
                                  {db.customers.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>Pagamento</Label>
                              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                <SelectContent>
                                  <SelectItem value="PIX">PIX</SelectItem>
                                  <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                                  <SelectItem value="Cartão">Cartão</SelectItem>
                                  <SelectItem value="Fiado">Fiado</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="border-t pt-4">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm text-slate-500">Total</span>
                              <span className="text-xl font-semibold">{brl(cartTotal)}</span>
                            </div>
                            <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={finalizeSale} disabled={!cart.length}>Finalizar venda</Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="sales" className="space-y-4">
                    <div><h2 className="text-2xl font-semibold">Vendas</h2><p className="text-sm text-slate-500">Histórico do PDV</p></div>
                    <Card className="rounded-2xl overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nº</TableHead>
                            <TableHead>Data</TableHead>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Pagamento</TableHead>
                            <TableHead>Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {db.sales.length === 0 ? <TableRow><TableCell colSpan={5} className="text-center py-8 text-slate-400">Nenhuma venda registrada.</TableCell></TableRow> : db.sales.map((sale) => (
                            <TableRow key={sale.id}>
                              <TableCell>#{sale.number}</TableCell>
                              <TableCell>{sale.date}</TableCell>
                              <TableCell>{customerName(sale.customerId)}</TableCell>
                              <TableCell>{sale.paymentMethod}</TableCell>
                              <TableCell>{brl(sale.total)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Card>
                  </TabsContent>

                  <TabsContent value="purchases" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div><h2 className="text-2xl font-semibold">Compras</h2><p className="text-sm text-slate-500">Entrada de estoque</p></div>
                      <Button onClick={() => setPurchaseModal(true)} className="bg-blue-600 hover:bg-blue-700">Nova compra</Button>
                    </div>
                    <Card className="rounded-2xl overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Data</TableHead>
                            <TableHead>Produto</TableHead>
                            <TableHead>Qtd</TableHead>
                            <TableHead>Custo Unit.</TableHead>
                            <TableHead>Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {db.purchases.length === 0 ? <TableRow><TableCell colSpan={5} className="text-center py-8 text-slate-400">Nenhuma compra registrada.</TableCell></TableRow> : db.purchases.map((p) => (
                            <TableRow key={p.id}>
                              <TableCell>{p.date}</TableCell>
                              <TableCell>{productName(p.productId)}</TableCell>
                              <TableCell>{p.qty}</TableCell>
                              <TableCell>{brl(p.unitCost)}</TableCell>
                              <TableCell>{brl(p.total)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Card>
                  </TabsContent>

                  <TabsContent value="returns" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div><h2 className="text-2xl font-semibold">Devoluções</h2><p className="text-sm text-slate-500">Recomposição de estoque</p></div>
                      <Button onClick={() => setReturnModal(true)} className="bg-blue-600 hover:bg-blue-700">Nova devolução</Button>
                    </div>
                    <Card className="rounded-2xl overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Data</TableHead>
                            <TableHead>Venda</TableHead>
                            <TableHead>Produto</TableHead>
                            <TableHead>Qtd</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Motivo</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {db.returns.length === 0 ? <TableRow><TableCell colSpan={6} className="text-center py-8 text-slate-400">Nenhuma devolução registrada.</TableCell></TableRow> : db.returns.map((r) => (
                            <TableRow key={r.id}>
                              <TableCell>{r.date}</TableCell>
                              <TableCell>#{db.sales.find((s) => s.id === r.saleId)?.number || "—"}</TableCell>
                              <TableCell>{productName(r.productId)}</TableCell>
                              <TableCell>{r.qty}</TableCell>
                              <TableCell>{brl(r.total)}</TableCell>
                              <TableCell>{r.reason || "—"}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Card>
                  </TabsContent>

                  <TabsContent value="customers" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div><h2 className="text-2xl font-semibold">Clientes</h2><p className="text-sm text-slate-500">Base comercial</p></div>
                      <Button onClick={() => setCustomerModal(true)} className="bg-blue-600 hover:bg-blue-700">Cliente</Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {db.customers.map((c) => (
                        <Card key={c.id} className="rounded-2xl">
                          <CardContent className="p-5 space-y-2">
                            <div className="flex items-start justify-between gap-3">
                              <div><p className="font-semibold">{c.name}</p><p className="text-sm text-slate-500">{c.city}</p></div>
                              <Badge variant="secondary">{c.status}</Badge>
                            </div>
                            <p className="text-sm text-slate-500">{c.phone || "Sem telefone"}</p>
                            <p className="text-sm">Limite: {brl(c.creditLimit)}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="finance" className="space-y-4">
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setReceivableModal(true)}>Novo receber</Button>
                      <Button variant="outline" onClick={() => setPayableModal(true)}>Novo pagar</Button>
                    </div>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                      <Card className="rounded-2xl overflow-hidden">
                        <CardHeader><CardTitle>A receber</CardTitle></CardHeader>
                        <CardContent className="p-0">
                          <Table>
                            <TableHeader><TableRow><TableHead>Descrição</TableHead><TableHead>Cliente</TableHead><TableHead>Vencimento</TableHead><TableHead>Valor</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                            <TableBody>
                              {db.receivables.length === 0 ? <TableRow><TableCell colSpan={5} className="text-center py-8 text-slate-400">Sem títulos.</TableCell></TableRow> : db.receivables.map((item) => (
                                <TableRow key={item.id}>
                                  <TableCell>{item.description}</TableCell>
                                  <TableCell>{customerName(item.customerId)}</TableCell>
                                  <TableCell>{item.dueDate}</TableCell>
                                  <TableCell>{brl(item.amount)}</TableCell>
                                  <TableCell>{item.status === "Aberto" ? <Button size="sm" variant="outline" onClick={() => markPaid("receivables", item.id)}>Baixar</Button> : <Badge variant="secondary">Pago</Badge>}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>

                      <Card className="rounded-2xl overflow-hidden">
                        <CardHeader><CardTitle>A pagar</CardTitle></CardHeader>
                        <CardContent className="p-0">
                          <Table>
                            <TableHeader><TableRow><TableHead>Descrição</TableHead><TableHead>Fornecedor</TableHead><TableHead>Vencimento</TableHead><TableHead>Valor</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                            <TableBody>
                              {db.payables.length === 0 ? <TableRow><TableCell colSpan={5} className="text-center py-8 text-slate-400">Sem contas.</TableCell></TableRow> : db.payables.map((item) => (
                                <TableRow key={item.id}>
                                  <TableCell>{item.description}</TableCell>
                                  <TableCell>{item.supplier || "—"}</TableCell>
                                  <TableCell>{item.dueDate}</TableCell>
                                  <TableCell>{brl(item.amount)}</TableCell>
                                  <TableCell>{item.status === "Aberto" ? <Button size="sm" variant="outline" onClick={() => markPaid("payables", item.id)}>Baixar</Button> : <Badge variant="secondary">Pago</Badge>}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="reports" className="space-y-4">
                    <div><h2 className="text-2xl font-semibold">Relatórios</h2><p className="text-sm text-slate-500">Leitura rápida do negócio</p></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                      <Card className="rounded-2xl"><CardContent className="p-5"><p className="text-xs uppercase tracking-wide text-slate-500">Vendas</p><p className="text-3xl font-bold mt-2">{db.sales.length}</p></CardContent></Card>
                      <Card className="rounded-2xl"><CardContent className="p-5"><p className="text-xs uppercase tracking-wide text-slate-500">Compras</p><p className="text-3xl font-bold mt-2">{db.purchases.length}</p></CardContent></Card>
                      <Card className="rounded-2xl"><CardContent className="p-5"><p className="text-xs uppercase tracking-wide text-slate-500">Devoluções</p><p className="text-3xl font-bold mt-2">{db.returns.length}</p></CardContent></Card>
                      <Card className="rounded-2xl"><CardContent className="p-5"><p className="text-xs uppercase tracking-wide text-slate-500">Ticket médio</p><p className="text-3xl font-bold mt-2">{brl(db.sales.length ? db.sales.reduce((s, i) => s + i.total, 0) / db.sales.length : 0)}</p></CardContent></Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="chat" className="space-y-4">
                    <div><h2 className="text-2xl font-semibold">Mensagens</h2><p className="text-sm text-slate-500">Chat interno simples</p></div>
                    <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr] gap-4">
                      <Card className="rounded-2xl">
                        <CardHeader><CardTitle>Canais</CardTitle></CardHeader>
                        <CardContent className="space-y-2">
                          {db.chatThreads.map((thread) => (
                            <button key={thread.id} onClick={() => setSelectedThreadId(thread.id)} className={`w-full text-left border rounded-2xl p-3 ${selectedThreadId === thread.id ? "bg-slate-100" : "bg-white"}`}>
                              <p className="font-medium text-sm">{thread.title}</p>
                              <p className="text-xs text-slate-500">{thread.messages.length} mensagem(ns)</p>
                            </button>
                          ))}
                        </CardContent>
                      </Card>

                      <Card className="rounded-2xl">
                        <CardHeader><CardTitle>{activeThread?.title || "Canal"}</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                          <ScrollArea className="h-[320px] pr-3">
                            <div className="space-y-3">
                              {activeThread?.messages?.length ? activeThread.messages.map((m) => (
                                <div key={m.id} className="border rounded-2xl p-3">
                                  <div className="flex items-center justify-between gap-2">
                                    <p className="font-medium text-sm">{m.sender}</p>
                                    <p className="text-xs text-slate-500">{new Date(m.at).toLocaleString("pt-BR")}</p>
                                  </div>
                                  <p className="text-sm text-slate-700 mt-2">{m.text}</p>
                                </div>
                              )) : <p className="text-sm text-slate-500">Sem mensagens.</p>}
                            </div>
                          </ScrollArea>
                          <div className="flex gap-2">
                            <Textarea value={chatMessage} onChange={(e) => setChatMessage(e.target.value)} placeholder="Digite uma mensagem" />
                            <Button onClick={sendChatMessage}>Enviar</Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="admin" className="space-y-4">
                    <div><h2 className="text-2xl font-semibold">Admin</h2><p className="text-sm text-slate-500">Usuários do sistema</p></div>
                    <Card className="rounded-2xl overflow-hidden">
                      <Table>
                        <TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>E-mail</TableHead><TableHead>Perfil</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                        <TableBody>
                          {db.users.map((u) => (
                            <TableRow key={u.id}>
                              <TableCell>{u.name}</TableCell>
                              <TableCell>{u.email}</TableCell>
                              <TableCell>{u.role}</TableCell>
                              <TableCell><Badge variant="secondary">{u.status}</Badge></TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Dialog open={productModal}>
        <DialogContent>
          <DialogHeader><DialogTitle>Novo produto</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>SKU</Label><Input value={productForm.sku} onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })} /></div>
            <div><Label>Categoria</Label><Input value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} /></div>
            <div className="col-span-2"><Label>Nome</Label><Input value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} /></div>
            <div><Label>Custo</Label><Input value={productForm.cost} onChange={(e) => setProductForm({ ...productForm, cost: e.target.value })} /></div>
            <div><Label>Preço</Label><Input value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} /></div>
            <div><Label>Estoque</Label><Input value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} /></div>
            <div><Label>Estoque mínimo</Label><Input value={productForm.minStock} onChange={(e) => setProductForm({ ...productForm, minStock: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProductModal(false)}>Cancelar</Button>
            <Button onClick={addProduct}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={customerModal}>
        <DialogContent>
          <DialogHeader><DialogTitle>Novo cliente</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2"><Label>Nome</Label><Input value={customerForm.name} onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })} /></div>
            <div><Label>Telefone</Label><Input value={customerForm.phone} onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })} /></div>
            <div><Label>Cidade</Label><Input value={customerForm.city} onChange={(e) => setCustomerForm({ ...customerForm, city: e.target.value })} /></div>
            <div><Label>Limite</Label><Input value={customerForm.creditLimit} onChange={(e) => setCustomerForm({ ...customerForm, creditLimit: e.target.value })} /></div>
            <div><Label>Status</Label><Input value={customerForm.status} onChange={(e) => setCustomerForm({ ...customerForm, status: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCustomerModal(false)}>Cancelar</Button>
            <Button onClick={addCustomer}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={purchaseModal}>
        <DialogContent>
          <DialogHeader><DialogTitle>Nova compra</DialogTitle></DialogHeader>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <Label>Produto</Label>
              <Select value={purchaseForm.productId} onValueChange={(v) => setPurchaseForm({ ...purchaseForm, productId: v })}>
                <SelectContent>
                  <SelectItem value="">Selecione</SelectItem>
                  {db.products.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div><Label>Quantidade</Label><Input value={purchaseForm.qty} onChange={(e) => setPurchaseForm({ ...purchaseForm, qty: e.target.value })} /></div>
            <div><Label>Custo unitário</Label><Input value={purchaseForm.unitCost} onChange={(e) => setPurchaseForm({ ...purchaseForm, unitCost: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPurchaseModal(false)}>Cancelar</Button>
            <Button onClick={addPurchase}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={returnModal}>
        <DialogContent>
          <DialogHeader><DialogTitle>Nova devolução</DialogTitle></DialogHeader>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <Label>Venda</Label>
              <Select value={returnForm.saleId} onValueChange={(v) => setReturnForm({ ...returnForm, saleId: v, productId: "" })}>
                <SelectContent>
                  <SelectItem value="">Selecione</SelectItem>
                  {db.sales.map((s) => <SelectItem key={s.id} value={s.id}>#{s.number}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Produto</Label>
              <Select value={returnForm.productId} onValueChange={(v) => setReturnForm({ ...returnForm, productId: v })}>
                <SelectContent>
                  <SelectItem value="">Selecione</SelectItem>
                  {(db.sales.find((s) => s.id === returnForm.saleId)?.items || []).map((item) => <SelectItem key={item.productId} value={item.productId}>{item.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div><Label>Quantidade</Label><Input value={returnForm.qty} onChange={(e) => setReturnForm({ ...returnForm, qty: e.target.value })} /></div>
            <div><Label>Motivo</Label><Textarea value={returnForm.reason} onChange={(e) => setReturnForm({ ...returnForm, reason: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReturnModal(false)}>Cancelar</Button>
            <Button onClick={addReturn}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={receivableModal}>
        <DialogContent>
          <DialogHeader><DialogTitle>Novo a receber</DialogTitle></DialogHeader>
          <div className="grid grid-cols-1 gap-3">
            <div><Label>Descrição</Label><Input value={receivableForm.description} onChange={(e) => setReceivableForm({ ...receivableForm, description: e.target.value })} /></div>
            <div>
              <Label>Cliente</Label>
              <Select value={receivableForm.customerId} onValueChange={(v) => setReceivableForm({ ...receivableForm, customerId: v })}>
                <SelectContent>
                  <SelectItem value="">Consumidor Final</SelectItem>
                  {db.customers.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div><Label>Valor</Label><Input value={receivableForm.amount} onChange={(e) => setReceivableForm({ ...receivableForm, amount: e.target.value })} /></div>
            <div><Label>Vencimento</Label><Input type="date" value={receivableForm.dueDate} onChange={(e) => setReceivableForm({ ...receivableForm, dueDate: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReceivableModal(false)}>Cancelar</Button>
            <Button onClick={addReceivable}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={payableModal}>
        <DialogContent>
          <DialogHeader><DialogTitle>Novo a pagar</DialogTitle></DialogHeader>
          <div className="grid grid-cols-1 gap-3">
            <div><Label>Descrição</Label><Input value={payableForm.description} onChange={(e) => setPayableForm({ ...payableForm, description: e.target.value })} /></div>
            <div><Label>Fornecedor</Label><Input value={payableForm.supplier} onChange={(e) => setPayableForm({ ...payableForm, supplier: e.target.value })} /></div>
            <div><Label>Valor</Label><Input value={payableForm.amount} onChange={(e) => setPayableForm({ ...payableForm, amount: e.target.value })} /></div>
            <div><Label>Vencimento</Label><Input type="date" value={payableForm.dueDate} onChange={(e) => setPayableForm({ ...payableForm, dueDate: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPayableModal(false)}>Cancelar</Button>
            <Button onClick={addPayable}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}