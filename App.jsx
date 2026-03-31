import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";











import { ShoppingCart, Package, Users, Wallet, LayoutDashboard, Plus, Trash2, FileBarChart, MessageSquare, Shield, RefreshCcw, Download, Upload, UserCog, Truck, Undo2, Search, Bell, Settings, BarChart3, ClipboardList, CreditCard, Boxes, Home, ChevronRight, AlertTriangle } from "lucide-react";


const cn=(...c)=>c.filter(Boolean).join(" ");
const Card=({className='',...p})=><div className={cn('bg-white',className)} {...p}/>;
const CardContent=({className='',...p})=><div className={className} {...p}/>;
const CardHeader=({className='',...p})=><div className={className} {...p}/>;
const CardTitle=({className='',...p})=><div className={cn('font-semibold',className)} {...p}/>;
const Button=({className='',variant,size,children,...p})=><button className={cn('px-3 py-2 border rounded',className)} {...p}>{children}</button>;
const Input=({className='',...p})=><input className={cn('px-3 py-2 border rounded',className)} {...p}/>;
const Label=({className='',...p})=><label className={className} {...p}/>;
const Tabs=({value,onValueChange,className='',children})=><div className={className}>{children}</div>;
const TabsList=({className='',...p})=><div className={className} {...p}/>;
const TabsTrigger=({children,...p})=><button {...p}>{children}</button>;
const TabsContent=({value,className='',children})=><div className={className}>{children}</div>;
const Dialog=({open,children})=>open?<div>{children}</div>:null;
const DialogContent=({className='',children})=><div className={cn('fixed inset-0 bg-black/20 p-8 overflow-auto',className)}><div className='bg-white max-w-2xl mx-auto p-4 rounded'>{children}</div></div>;
const DialogHeader=({className='',...p})=><div className={className} {...p}/>;
const DialogTitle=({className='',...p})=><div className={cn('font-semibold text-lg',className)} {...p}/>;
const DialogFooter=({className='',...p})=><div className={cn('flex gap-2 justify-end',className)} {...p}/>;
const Badge=({className='',children,...p})=><span className={cn('inline-flex px-2 py-1 rounded border text-xs',className)} {...p}>{children}</span>;
const Table=({className='',...p})=><table className={cn('w-full',className)} {...p}/>;
const TableBody=(p)=><tbody {...p}/>; const TableCell=({className='',...p})=><td className={cn('p-2 border-t',className)} {...p}/>;
const TableHead=({className='',...p})=><th className={cn('p-2 text-left',className)} {...p}/>; const TableHeader=(p)=><thead {...p}/>; const TableRow=(p)=><tr {...p}/>;
const Select=({value,onValueChange,children})=> <div data-select>{React.Children.map(children, child=>React.cloneElement(child,{value,onValueChange}))}</div>;
const SelectTrigger=({className='',children})=><div className={cn('px-3 py-2 border rounded',className)}>{children}</div>;
const SelectValue=({placeholder})=><span>{placeholder||''}</span>;
const SelectContent=({children,value,onValueChange})=><select className='px-3 py-2 border rounded w-full' value={value} onChange={e=>onValueChange?.(e.target.value)}>{React.Children.map(children, c=>c)}</select>;
const SelectItem=({value,children})=><option value={value}>{children}</option>;
const Textarea=({className='',...p})=><textarea className={cn('px-3 py-2 border rounded',className)} {...p}/>;
const ScrollArea=({className='',children})=><div className={cn('overflow-auto',className)}>{children}</div>;

const STORAGE_KEY = "nexus-erp-full-v2";

const seed = {
  products: [
    { id: crypto.randomUUID(), sku: "AV-001", name: "Sutiã Renda Essencial", category: "Lingerie", cost: 39.9, price: 89.9, stock: 12, minStock: 4, supplierId: null },
    { id: crypto.randomUUID(), sku: "AV-002", name: "Calcinha Soft Premium", category: "Lingerie", cost: 19.9, price: 44.9, stock: 20, minStock: 6, supplierId: null },
    { id: crypto.randomUUID(), sku: "AV-003", name: "Colar Ponto de Luz", category: "Joias", cost: 120, price: 249.9, stock: 5, minStock: 2, supplierId: null },
  ],
  customers: [
    { id: crypto.randomUUID(), name: "Consumidor Final", phone: "", city: "Manaus", creditLimit: 0, status: "Ativo" },
    { id: crypto.randomUUID(), name: "Maria Oliveira", phone: "(92) 99999-0001", city: "Manaus", creditLimit: 300, status: "Ativo" },
  ],
  suppliers: [
    { id: crypto.randomUUID(), name: "Fornecedor Premium", phone: "(11) 98888-0001", contact: "Ana", category: "Lingerie" },
  ],
  users: [
    { id: crypto.randomUUID(), name: "Administrador", email: "admin@nexus.local", role: "Administrador", status: "Ativo" },
    { id: crypto.randomUUID(), name: "Vendedora 01", email: "vendas1@nexus.local", role: "Vendedor", status: "Ativo" },
  ],
  permissions: [
    { role: "Administrador", modules: ["dashboard", "products", "customers", "suppliers", "pdv", "sales", "purchases", "returns", "finance", "reports", "chat", "users", "logs", "backup"] },
    { role: "Vendedor", modules: ["dashboard", "products", "customers", "pdv", "sales", "returns", "chat"] },
    { role: "Financeiro", modules: ["dashboard", "finance", "reports", "customers"] },
  ],
  sales: [],
  purchases: [],
  returns: [],
  receivables: [],
  payables: [],
  chatThreads: [
    { id: crypto.randomUUID(), title: "Equipe Loja", messages: [{ id: crypto.randomUUID(), sender: "Administrador", text: "Bom dia, time. Bora vender com método.", at: new Date().toISOString() }] },
  ],
  logs: [],
  backups: [],
};

function brl(value) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value || 0));
}
function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
function dtNow() {
  return new Date().toISOString();
}
function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seed;
    return JSON.parse(raw);
  } catch {
    return seed;
  }
}
function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
function KPI({ title, value, hint, icon: Icon }) {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
          <p className="text-xs text-slate-500 mt-1">{hint}</p>
        </div>
        <div className="rounded-2xl p-3 bg-slate-100"><Icon className="w-5 h-5" /></div>
      </CardContent>
    </Card>
  );
}
function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        {subtitle ? <p className="text-sm text-slate-500 mt-1">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

export default function NexusERPFull() {
  const navItems = [
    { key: "dashboard", label: "Dashboard", icon: Home },
    { key: "products", label: "Estoque", icon: Boxes },
    { key: "sales", label: "Vendas", icon: ShoppingCart },
    { key: "purchases", label: "Compras", icon: Truck },
    { key: "returns", label: "Devoluções", icon: Undo2 },
    { key: "customers", label: "Clientes", icon: Users },
    { key: "finance", label: "Financeiro", icon: CreditCard },
    { key: "reports", label: "Relatórios", icon: BarChart3 },
    { key: "chat", label: "Mensagens", icon: MessageSquare },
    { key: "admin", label: "Configurações", icon: Settings },
  ];
  const [db, setDb] = useState(seed);
  const [tab, setTab] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [productCategory, setProductCategory] = useState("todos");
  const [financeSearch, setFinanceSearch] = useState("");
  const [financeMode, setFinanceMode] = useState("receber");
  const [purchaseSearch, setPurchaseSearch] = useState("");
  const [returnSearch, setReturnSearch] = useState("");
  const [reportFilter, setReportFilter] = useState("geral");
  const [adminView, setAdminView] = useState("users");
  const [productModal, setProductModal] = useState(false);
  const [customerModal, setCustomerModal] = useState(false);
  const [supplierModal, setSupplierModal] = useState(false);
  const [userModal, setUserModal] = useState(false);
  const [payableModal, setPayableModal] = useState(false);
  const [receivableModal, setReceivableModal] = useState(false);
  const [purchaseModal, setPurchaseModal] = useState(false);
  const [returnModal, setReturnModal] = useState(false);
  const [selectedThreadId, setSelectedThreadId] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [cart, setCart] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("PIX");

  const [productForm, setProductForm] = useState({ sku: "", name: "", category: "Lingerie", cost: "", price: "", stock: "", minStock: "", supplierId: "" });
  const [customerForm, setCustomerForm] = useState({ name: "", phone: "", city: "Manaus", creditLimit: "", status: "Ativo" });
  const [supplierForm, setSupplierForm] = useState({ name: "", phone: "", contact: "", category: "Lingerie" });
  const [userForm, setUserForm] = useState({ name: "", email: "", role: "Vendedor", status: "Ativo" });
  const [payableForm, setPayableForm] = useState({ description: "", supplier: "", amount: "", dueDate: todayISO() });
  const [receivableForm, setReceivableForm] = useState({ description: "", customerId: "", amount: "", dueDate: todayISO() });
  const [purchaseForm, setPurchaseForm] = useState({ supplierId: "", productId: "", qty: "", unitCost: "", note: "" });
  const [returnForm, setReturnForm] = useState({ saleId: "", productId: "", qty: "", reason: "" });

  useEffect(() => { setDb(loadData()); }, []);
  useEffect(() => { saveData(db); }, [db]);
  useEffect(() => {
    if (!selectedThreadId && db.chatThreads[0]) setSelectedThreadId(db.chatThreads[0].id);
  }, [db.chatThreads, selectedThreadId]);

  function appendLog(action, module, detail) {
    setDb((prev) => ({
      ...prev,
      logs: [{ id: crypto.randomUUID(), at: dtNow(), action, module, detail }, ...prev.logs],
    }));
  }

  function updateDb(updater, logInfo) {
    setDb((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      if (!logInfo) return next;
      return {
        ...next,
        logs: [{ id: crypto.randomUUID(), at: dtNow(), action: logInfo.action, module: logInfo.module, detail: logInfo.detail }, ...(next.logs || [])],
      };
    });
  }

  const metrics = useMemo(() => {
    const today = todayISO();
    const salesToday = db.sales.filter((s) => s.date === today);
    const revenueToday = salesToday.reduce((sum, sale) => sum + sale.total, 0);
    const lowStock = db.products.filter((p) => p.stock <= p.minStock).length;
    const openReceivables = db.receivables.filter((r) => r.status === "Aberto").reduce((sum, r) => sum + r.amount, 0);
    const openPayables = db.payables.filter((p) => p.status === "Aberto").reduce((sum, p) => sum + p.amount, 0);
    return { revenueToday, lowStock, openReceivables, openPayables };
  }, [db]);

  const filteredProducts = useMemo(() => {
    const term = search.toLowerCase().trim();
    return db.products.filter((p) => !term || p.name.toLowerCase().includes(term) || p.sku.toLowerCase().includes(term));
  }, [db.products, search]);

  const reportData = useMemo(() => {
    const salesTotal = db.sales.reduce((sum, item) => sum + item.total, 0);
    const purchaseTotal = db.purchases.reduce((sum, item) => sum + item.total, 0);
    const margin = salesTotal - purchaseTotal;
    return { salesTotal, purchaseTotal, margin, returns: db.returns.reduce((s, r) => s + r.total, 0) };
  }, [db]);

  const activeThread = db.chatThreads.find((t) => t.id === selectedThreadId);

  function addProduct() {
    if (!productForm.name || !productForm.sku) return;
    const item = { id: crypto.randomUUID(), sku: productForm.sku.trim(), name: productForm.name.trim(), category: productForm.category, cost: Number(productForm.cost || 0), price: Number(productForm.price || 0), stock: Number(productForm.stock || 0), minStock: Number(productForm.minStock || 0), supplierId: productForm.supplierId || null };
    updateDb((prev) => ({ ...prev, products: [item, ...prev.products] }), { action: "Criou produto", module: "Estoque", detail: item.name });
    setProductForm({ sku: "", name: "", category: "Lingerie", cost: "", price: "", stock: "", minStock: "", supplierId: "" });
    setProductModal(false);
  }
  function addCustomer() {
    if (!customerForm.name) return;
    const item = { id: crypto.randomUUID(), name: customerForm.name.trim(), phone: customerForm.phone.trim(), city: customerForm.city.trim(), creditLimit: Number(customerForm.creditLimit || 0), status: customerForm.status };
    updateDb((prev) => ({ ...prev, customers: [item, ...prev.customers] }), { action: "Criou cliente", module: "Clientes", detail: item.name });
    setCustomerForm({ name: "", phone: "", city: "Manaus", creditLimit: "", status: "Ativo" });
    setCustomerModal(false);
  }
  function addSupplier() {
    if (!supplierForm.name) return;
    const item = { id: crypto.randomUUID(), ...supplierForm };
    updateDb((prev) => ({ ...prev, suppliers: [item, ...prev.suppliers] }), { action: "Criou fornecedor", module: "Compras", detail: item.name });
    setSupplierForm({ name: "", phone: "", contact: "", category: "Lingerie" });
    setSupplierModal(false);
  }
  function addUser() {
    if (!userForm.name || !userForm.email) return;
    const item = { id: crypto.randomUUID(), ...userForm };
    updateDb((prev) => ({ ...prev, users: [item, ...prev.users] }), { action: "Criou usuário", module: "Permissões", detail: item.name });
    setUserForm({ name: "", email: "", role: "Vendedor", status: "Ativo" });
    setUserModal(false);
  }
  function addPayable() {
    if (!payableForm.description || !payableForm.amount) return;
    const item = { id: crypto.randomUUID(), description: payableForm.description, supplier: payableForm.supplier, amount: Number(payableForm.amount), dueDate: payableForm.dueDate, status: "Aberto" };
    updateDb((prev) => ({ ...prev, payables: [item, ...prev.payables] }), { action: "Criou conta a pagar", module: "Financeiro", detail: item.description });
    setPayableForm({ description: "", supplier: "", amount: "", dueDate: todayISO() });
    setPayableModal(false);
  }
  function addReceivable() {
    if (!receivableForm.description || !receivableForm.amount) return;
    const item = { id: crypto.randomUUID(), description: receivableForm.description, customerId: receivableForm.customerId || null, amount: Number(receivableForm.amount), dueDate: receivableForm.dueDate, status: "Aberto" };
    updateDb((prev) => ({ ...prev, receivables: [item, ...prev.receivables] }), { action: "Criou conta a receber", module: "Financeiro", detail: item.description });
    setReceivableForm({ description: "", customerId: "", amount: "", dueDate: todayISO() });
    setReceivableModal(false);
  }
  function addPurchase() {
    if (!purchaseForm.productId || !purchaseForm.qty || !purchaseForm.unitCost) return;
    const product = db.products.find((p) => p.id === purchaseForm.productId);
    const supplier = db.suppliers.find((s) => s.id === purchaseForm.supplierId);
    const qty = Number(purchaseForm.qty || 0);
    const unitCost = Number(purchaseForm.unitCost || 0);
    const purchase = { id: crypto.randomUUID(), date: todayISO(), productId: purchaseForm.productId, supplierId: purchaseForm.supplierId || null, qty, unitCost, total: qty * unitCost, note: purchaseForm.note };
    updateDb((prev) => ({
      ...prev,
      purchases: [purchase, ...prev.purchases],
      products: prev.products.map((p) => p.id === purchase.productId ? { ...p, stock: p.stock + qty, cost: unitCost, supplierId: purchase.supplierId || p.supplierId } : p),
      payables: supplier ? [{ id: crypto.randomUUID(), description: `Compra ${product?.name || "Produto"}`, supplier: supplier.name, amount: qty * unitCost, dueDate: todayISO(), status: "Aberto" }, ...prev.payables] : prev.payables,
    }), { action: "Registrou compra", module: "Compras", detail: product?.name || "Produto" });
    setPurchaseForm({ supplierId: "", productId: "", qty: "", unitCost: "", note: "" });
    setPurchaseModal(false);
  }
  function addReturn() {
    if (!returnForm.saleId || !returnForm.productId || !returnForm.qty) return;
    const sale = db.sales.find((s) => s.id === returnForm.saleId);
    const product = db.products.find((p) => p.id === returnForm.productId);
    const soldItem = sale?.items.find((i) => i.productId === returnForm.productId);
    const qty = Number(returnForm.qty || 0);
    const unit = soldItem?.price || product?.price || 0;
    const item = { id: crypto.randomUUID(), saleId: returnForm.saleId, productId: returnForm.productId, qty, reason: returnForm.reason, total: qty * unit, date: todayISO() };
    updateDb((prev) => ({
      ...prev,
      returns: [item, ...prev.returns],
      products: prev.products.map((p) => p.id === item.productId ? { ...p, stock: p.stock + qty } : p),
    }), { action: "Registrou devolução", module: "Devoluções", detail: product?.name || "Produto" });
    setReturnForm({ saleId: "", productId: "", qty: "", reason: "" });
    setReturnModal(false);
  }
  function addToCart(product) {
    if (product.stock <= 0) return;
    setCart((prev) => {
      const found = prev.find((item) => item.productId === product.id);
      if (found) return prev.map((item) => item.productId === product.id ? { ...item, qty: Math.min(item.qty + 1, product.stock) } : item);
      return [...prev, { productId: product.id, name: product.name, price: product.price, qty: 1 }];
    });
  }
  function updateQty(productId, delta) {
    setCart((prev) => prev.map((item) => item.productId === productId ? { ...item, qty: item.qty + delta } : item).filter((item) => item.qty > 0));
  }
  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.qty, 0), [cart]);
  function finalizeSale() {
    if (!cart.length) return;
    updateDb((prev) => {
      const sale = { id: crypto.randomUUID(), number: prev.sales.length + 1, date: todayISO(), customerId: customerId || null, paymentMethod, items: cart, total: cartTotal };
      return {
        ...prev,
        sales: [sale, ...prev.sales],
        products: prev.products.map((product) => {
          const item = cart.find((c) => c.productId === product.id);
          return item ? { ...product, stock: Math.max(0, product.stock - item.qty) } : product;
        }),
        receivables: paymentMethod === "Fiado" ? [{ id: crypto.randomUUID(), description: `Venda #${sale.number}`, customerId: customerId || null, amount: cartTotal, dueDate: todayISO(), status: "Aberto" }, ...prev.receivables] : prev.receivables,
      };
    }, { action: "Finalizou venda", module: "PDV", detail: `Total ${brl(cartTotal)}` });
    setCart([]);
    setCustomerId("");
    setPaymentMethod("PIX");
    setTab("sales");
  }
  function markPaid(type, id) {
    updateDb((prev) => ({ ...prev, [type]: prev[type].map((item) => item.id === id ? { ...item, status: "Pago" } : item) }), { action: "Baixou título", module: "Financeiro", detail: `${type}:${id}` });
  }
  function removeItem(type, id) {
    updateDb((prev) => ({ ...prev, [type]: prev[type].filter((item) => item.id !== id) }), { action: "Removeu registro", module: type, detail: id });
  }
  function customerName(id) {
    return db.customers.find((c) => c.id === id)?.name || "Consumidor Final";
  }
  function supplierName(id) {
    return db.suppliers.find((s) => s.id === id)?.name || "—";
  }
  function productName(id) {
    return db.products.find((p) => p.id === id)?.name || "Produto";
  }
  function createBackup() {
    const snapshot = JSON.stringify(db, null, 2);
    const stamp = dtNow();
    const backup = { id: crypto.randomUUID(), at: stamp, size: snapshot.length, label: `backup-${stamp}` };
    updateDb((prev) => ({ ...prev, backups: [backup, ...prev.backups] }), { action: "Criou backup", module: "Backup", detail: backup.label });
    const blob = new Blob([snapshot], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${backup.label}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
  function importBackup(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        setDb({ ...parsed, logs: [{ id: crypto.randomUUID(), at: dtNow(), action: "Importou backup", module: "Backup", detail: file.name }, ...(parsed.logs || [])] });
      } catch {
        appendLog("Falha backup", "Backup", "Arquivo inválido");
      }
    };
    reader.readAsText(file);
  }
  function sendChatMessage() {
    if (!chatMessage.trim() || !activeThread) return;
    updateDb((prev) => ({
      ...prev,
      chatThreads: prev.chatThreads.map((thread) => thread.id === activeThread.id ? { ...thread, messages: [...thread.messages, { id: crypto.randomUUID(), sender: "Administrador", text: chatMessage.trim(), at: dtNow() }] } : thread),
    }), { action: "Enviou mensagem", module: "Chat", detail: chatMessage.slice(0, 40) });
    setChatMessage("");
  }

  return (
    <div className="min-h-screen bg-[#eef3f9] text-slate-900">
      <div className="flex min-h-screen">
        <aside className="w-[76px] bg-white border-r border-slate-200 flex flex-col items-center py-4 gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#2453ff] text-white flex items-center justify-center font-bold text-xl shadow-md">#</div>
          <div className="flex flex-col gap-3 mt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = tab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setTab(item.key)}
                  className={`w-11 h-11 rounded-xl flex items-center justify-center transition ${active ? "bg-[#eff4ff] text-[#2453ff]" : "text-slate-400 hover:bg-slate-100"}`}
                  title={item.label}
                >
                  <Icon className="w-5 h-5" />
                </button>
              );
            })}
          </div>
          <div className="mt-auto flex flex-col items-center gap-4 w-full px-2">
            <div className="w-full rounded-2xl bg-[#f4f7fb] border border-slate-200 p-3">
              <p className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold">Caixa hoje</p>
              <p className="text-lg font-semibold text-[#00a36c] mt-1">{brl(metrics.revenueToday)}</p>
              <div className="h-2 rounded-full bg-slate-200 mt-2 overflow-hidden">
                <div className="h-full w-1/3 bg-[#2453ff] rounded-full" />
              </div>
            </div>
            <div className="w-11 h-11 rounded-full bg-[#eff4ff] text-[#2453ff] flex items-center justify-center text-sm font-bold">AD</div>
          </div>
        </aside>

        <aside className="w-[220px] bg-white border-r border-slate-200 px-4 py-5 hidden md:block">
          <div className="flex items-center gap-2 mb-6">
            <div className="text-sm font-semibold text-slate-700">Nexus erp - HTML</div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-semibold tracking-tight text-slate-800 mb-3">Dashboard</div>
            <button className="w-full rounded-xl bg-[#eaf1ff] text-[#2453ff] px-4 py-3 text-left font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#2453ff]" />
              Visão Geral
            </button>
          </div>
        </aside>

        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-[1400px] mx-auto">
            <div className="bg-white border border-slate-200 rounded-[28px] shadow-sm overflow-hidden">
              <div className="px-5 md:px-6 py-4 border-b border-slate-200 flex items-center gap-3">
                <div className="flex items-center gap-2 bg-[#f5f7fb] border border-slate-200 rounded-xl px-3 h-11 w-full max-w-[420px]">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input placeholder="Buscar produto, cliente, venda..." className="bg-transparent outline-none text-sm w-full placeholder:text-slate-400" />
                </div>
                <div className="ml-auto hidden lg:block text-sm text-slate-400">Segunda, 30 de março de 2026</div>
                <div className="flex items-center gap-3 ml-auto lg:ml-4">
                  <div className="rounded-xl border border-amber-200 bg-amber-50 text-amber-500 px-3 py-2 text-xs font-semibold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    3 alerta(s)
                  </div>
                  <button className="relative text-slate-400">
                    <Bell className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">1</span>
                  </button>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#eff4ff] text-[#2453ff] font-bold flex items-center justify-center text-xs">AD</div>
                    <div className="hidden md:block">
                      <div className="text-sm font-semibold text-slate-700">Administrador</div>
                      <div className="text-xs text-slate-400">Gerente</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 md:p-6">
                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-6">
                  <div>
                    <h1 className="text-[34px] leading-none font-bold tracking-tight text-slate-800">Olá, Administrador <span className="text-xl">👋</span></h1>
                    <p className="text-sm text-slate-400 mt-2">Segunda, 30 de março de 2026</p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Button variant="outline" className="rounded-xl h-10 border-slate-200 text-slate-500 bg-white"><Download className="w-4 h-4 mr-2" />Relatório</Button>
                    <Button className="rounded-xl h-10 bg-[#2453ff] hover:bg-[#1f46d6] text-white"><ShoppingCart className="w-4 h-4 mr-2" />Abrir PDV</Button>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap mb-5">
                  <span className="text-xs font-semibold text-slate-500 mr-1">Período:</span>
                  {['Hoje','Semana','Este Mês','Mês Anterior','Ano Atual','Ano Anterior','Personalizado'].map((p, i) => (
                    <button key={p} className={`h-9 px-4 rounded-xl text-xs font-semibold border ${i===2 ? 'bg-[#2453ff] text-white border-[#2453ff]' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}>{p}</button>
                  ))}
                </div>

                <Tabs value={tab} onValueChange={setTab} className="space-y-4">
          <TabsList className="hidden"><TabsTrigger value="dashboard">Dashboard</TabsTrigger></TabsList>

          <TabsContent value="dashboard" className="space-y-4 mt-0">
            {(() => {
              const dashboardSales = db.sales.length
                ? db.sales.slice(0, 5)
                : [
                    { number: 23, customerId: null, total: 54.9 },
                    { number: 22, customerId: null, total: 498 },
                    { number: 21, customerId: null, total: 228.8 },
                    { number: 20, customerId: null, total: 1978 },
                    { number: 19, customerId: null, total: 149.4 },
                  ];
              const dashboardStock = db.products.filter((p) => p.stock <= p.minStock).length
                ? db.products.filter((p) => p.stock <= p.minStock).slice(0, 3)
                : [
                    { name: 'Cabo HDMI 2m', category: 'Eletrônicos', stock: 0 },
                    { name: 'Tênis Esportivo 42', category: 'Vestuário', stock: 2 },
                    { name: 'Carregador USB-C 65W', category: 'Eletrônicos', stock: 3 },
                  ];
              const dashboardDue = [
                { desc: 'Aluguel — Março', due: '22/03/2026', value: 3200, status: 'Venceu há 8d', tone: 'text-red-500' },
                { desc: 'Parcela #1 — Notebook', due: '25/03/2026', value: 1649.5, status: 'Venceu há 5d', tone: 'text-red-500' },
                { desc: 'Saldo Fiado — Carlos', due: '28/03/2026', value: 350, status: 'Vence há 2d', tone: 'text-amber-500' },
                { desc: 'NF TechDistrib — Pedido', due: '31/03/2026', value: 8400, status: 'Vence hoje', tone: 'text-red-500' },
              ];
              const chartBars = [
                { m: '04/25', sales: 0, returns: 0 },
                { m: '05/25', sales: 0, returns: 0 },
                { m: '06/25', sales: 0, returns: 0 },
                { m: '07/25', sales: 0, returns: 0 },
                { m: '08/25', sales: 0, returns: 0 },
                { m: '09/25', sales: 0, returns: 0 },
                { m: '10/25', sales: 0, returns: 0 },
                { m: '11/25', sales: 0, returns: 0 },
                { m: '12/25', sales: 303.5, returns: 0 },
                { m: '01/26', sales: 6301.9, returns: 1899 },
                { m: '02/26', sales: 9732.3, returns: 0 },
                { m: '03/26', sales: 12676.3, returns: 0 },
              ];
              const maxBar = Math.max(...chartBars.map((i) => Math.max(i.sales, i.returns)), 1);
              const paymentTotal = 28710.5;
              const paymentSegments = [
                { label: 'PIX', value: 16550, color: '#2453ff', action: () => { setPaymentMethod('PIX'); setTab('pdv'); } },
                { label: 'Cartão Crédito', value: 9650.5, color: '#10b981', action: () => { setPaymentMethod('Cartão'); setTab('pdv'); } },
                { label: 'Dinheiro', value: 1650, color: '#f59e0b', action: () => { setPaymentMethod('Dinheiro'); setTab('pdv'); } },
                { label: 'Cartão Débito', value: 860, color: '#ef4444', action: () => { setPaymentMethod('Cartão'); setTab('pdv'); } },
              ];
              let cumulative = 0;
              const donutStops = paymentSegments.map((seg) => {
                const start = cumulative / paymentTotal;
                cumulative += seg.value;
                const end = cumulative / paymentTotal;
                return `${seg.color} ${Math.round(start * 360)}deg ${Math.round(end * 360)}deg`;
              }).join(', ');

              return (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    {[
                      { title: 'Faturamento do mês', value: brl(reportData.salesTotal || 12676.3), hint: '0% vs ontem', icon: Wallet, tone: 'text-[#2453ff]', bg: 'bg-[#eef4ff]', onClick: () => setTab('reports') },
                      { title: 'Vendas no mês', value: String(db.sales.length || 11), hint: '0% vs ontem', icon: ClipboardList, tone: 'text-[#10b981]', bg: 'bg-[#ecfdf5]', onClick: () => setTab('sales') },
                      { title: 'Ticket médio', value: brl((reportData.salesTotal / (db.sales.length || 11)) || 1152.39), hint: '0% vs ontem', icon: CreditCard, tone: 'text-[#f59e0b]', bg: 'bg-[#fff7ed]', onClick: () => setTab('sales') },
                      { title: 'A receber (em aberto)', value: brl(metrics.openReceivables || 5389.5), hint: '0% vs ontem', icon: BarChart3, tone: 'text-[#10b981]', bg: 'bg-[#effcf6]', onClick: () => setTab('finance') },
                      { title: 'A pagar (em aberto)', value: brl(metrics.openPayables || 22680), hint: '0% vs ontem', icon: Wallet, tone: 'text-[#ef4444]', bg: 'bg-[#fff1f2]', onClick: () => setTab('finance') },
                      { title: 'Devoluções do mês', value: String(db.returns.length || 1), hint: '0% vs ontem', icon: Undo2, tone: 'text-[#8b5cf6]', bg: 'bg-[#f5f3ff]', onClick: () => setTab('returns') },
                    ].map((kpi) => {
                      const Icon = kpi.icon;
                      return (
                        <motion.button key={kpi.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onClick={kpi.onClick} className="text-left">
                          <Card className="rounded-[18px] border border-[#e4ebf5] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.03)] hover:shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition-all">
                            <CardContent className="p-[22px] flex gap-4 items-start">
                              <div className={`w-12 h-12 rounded-[14px] ${kpi.bg} flex items-center justify-center ring-1 ring-white shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]`}>
                                <Icon className={`w-5 h-5 ${kpi.tone}`} />
                              </div>
                              <div>
                                <p className="text-[10px] uppercase tracking-[0.22em] text-[#9AA8BA] font-bold">{kpi.title}</p>
                                <p className="text-[34px] leading-none font-extrabold tracking-[-0.05em] text-[#16243d] mt-2">{kpi.value}</p>
                                <p className="text-[11px] text-[#12a150] mt-2 font-semibold">{kpi.hint}</p>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.button>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-[1.7fr_0.8fr] gap-4 mt-6">
                    <Card className="rounded-[20px] border border-[#e4ebf5] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
                      <CardHeader className="pb-3 flex flex-row items-start justify-between">
                        <div>
                          <CardTitle className="text-[16px] font-bold tracking-[-0.02em] text-[#1B2A41]">Faturamento — Últimos 12 meses</CardTitle>
                          <p className="text-[11px] text-[#9AA8BA] mt-1">Vendas x Devoluções</p>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-[#7C8DA4] font-medium">
                          <button onClick={() => setTab('sales')} className="flex items-center gap-1.5 hover:text-[#2453ff]"><span className="w-2.5 h-2.5 rounded-full bg-[#2453ff]" />Vendas</button>
                          <button onClick={() => setTab('returns')} className="flex items-center gap-1.5 hover:text-[#ef4444]"><span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />Devoluções</button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[280px] rounded-[18px] border border-[#edf2f7] bg-[linear-gradient(180deg,#ffffff_0%,#fbfdff_100%)] p-4 relative overflow-hidden">
                          <div className="absolute inset-x-4 top-6 bottom-10 grid grid-rows-5 pointer-events-none">
                            {[0,1,2,3,4].map((i) => <div key={i} className="border-t border-dashed border-[#e8eef6]" />)}
                          </div>
                          <div className="absolute left-4 top-4 text-[10px] text-[#9AA8BA]">R$14k</div>
                          <div className="absolute left-4 bottom-10 text-[10px] text-[#9AA8BA]">R$0</div>
                          <div className="absolute inset-x-6 bottom-8 top-8 flex items-end justify-between gap-3">
                            {chartBars.map((item) => {
                              const salesHeight = Math.max((item.sales / maxBar) * 100, item.sales > 0 ? 4 : 2);
                              const returnHeight = Math.max((item.returns / maxBar) * 100, item.returns > 0 ? 4 : 2);
                              return (
                                <button key={item.m} onClick={() => setTab(item.returns > 0 ? 'returns' : 'sales')} className="flex-1 flex flex-col items-center justify-end h-full gap-2 group">
                                  <div className="w-full flex items-end justify-center gap-[4px] h-full">
                                    <div className="w-[16px] rounded-t-[4px] bg-[linear-gradient(180deg,#fb7185_0%,#ef4444_100%)] shadow-[0_3px_8px_rgba(239,68,68,0.15)] transition-all group-hover:opacity-90" style={{ height: `${returnHeight}%` }} />
                                    <div className="w-[22px] rounded-t-[5px] bg-[linear-gradient(180deg,#5d7dff_0%,#2453ff_100%)] shadow-[0_8px_18px_rgba(36,83,255,0.24)] transition-all group-hover:translate-y-[-1px]" style={{ height: `${salesHeight}%` }} />
                                  </div>
                                  <span className="text-[10px] text-[#9AA8BA]">{item.m}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="rounded-[20px] border border-[#e4ebf5] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-[16px] font-bold tracking-[-0.02em] text-[#1B2A41]">Formas de Pagamento</CardTitle>
                        <p className="text-[11px] text-[#9AA8BA]">Distribuição do mês atual</p>
                      </CardHeader>
                      <CardContent className="flex flex-col items-center justify-center pt-2">
                        <div className="relative w-[230px] h-[230px] rounded-full flex items-center justify-center shadow-[inset_0_0_0_1px_rgba(255,255,255,0.7),0_10px_24px_rgba(15,23,42,0.05)]" style={{ background: `conic-gradient(${donutStops})` }}>
                          <div className="absolute inset-[16px] rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,rgba(255,255,255,0.18),rgba(255,255,255,0))]" />
                          <div className="w-[132px] h-[132px] rounded-full bg-white border border-[#eef2f7] shadow-[0_6px_18px_rgba(15,23,42,0.05)] flex flex-col items-center justify-center text-center z-10">
                            <div className="text-[11px] text-[#9AA8BA]">Total</div>
                            <div className="text-[28px] leading-none font-extrabold tracking-[-0.05em] text-[#16243d] mt-1">28.710,50</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px] text-[#7c8da4] mt-5 w-full max-w-[260px]">
                          {paymentSegments.map((seg) => (
                            <button key={seg.label} onClick={seg.action} className="flex items-center gap-2 hover:text-[#1B2A41] text-left">
                              <span className="w-2.5 h-2.5 rounded-full shadow-[0_0_0_2px_rgba(255,255,255,0.8)]" style={{ background: seg.color }} />
                              <span>{seg.label}</span>
                            </button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-[0.9fr_1.3fr_0.9fr] gap-4 mt-6">
                    <Card className="rounded-[20px] border border-[#e4ebf5] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
                      <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <CardTitle className="text-[16px] font-bold tracking-[-0.02em] text-[#1B2A41]">⚠️ Estoque Crítico</CardTitle>
                        <Button variant="outline" onClick={() => setTab('products')} className="rounded-[10px] h-8 text-[11px] border-[#e4ebf5] text-slate-500 bg-white shadow-none">Ver tudo</Button>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {dashboardStock.map((p, i) => (
                          <button key={i} onClick={() => setTab('products')} className="w-full flex items-center justify-between border-b border-[#eff3f8] pb-3 last:border-0 last:pb-0 text-left">
                            <div>
                              <div className="font-semibold text-[13px] text-[#22324A]">{p.name}</div>
                              <div className="text-[11px] text-[#9AA8BA]">{p.category || 'Geral'}</div>
                            </div>
                            <Badge className={`${(p.stock ?? 0) === 0 ? 'bg-[#fff1f2] text-[#ef4444] border border-[#fecdd3]' : 'bg-[#fff7ed] text-[#f59e0b] border border-[#fed7aa]'} rounded-[10px] hover:bg-inherit font-semibold shadow-none`}>
                              {(p.stock ?? 0) === 0 ? 'Esgotado' : `${p.stock} un`}
                            </Badge>
                          </button>
                        ))}
                      </CardContent>
                    </Card>

                    <Card className="rounded-[20px] border border-[#e4ebf5] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
                      <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <CardTitle className="text-[16px] font-bold tracking-[-0.02em] text-[#1B2A41]">Últimas Vendas</CardTitle>
                        <Button variant="outline" onClick={() => setTab('sales')} className="rounded-[10px] h-8 text-[11px] border-[#e4ebf5] text-slate-500 bg-white shadow-none">Ver tudo</Button>
                      </CardHeader>
                      <CardContent className="p-0">
                        <Table className="[&_th]:text-[10px] [&_th]:uppercase [&_th]:tracking-[0.18em] [&_th]:text-[#A0AEC0] [&_th]:font-bold [&_td]:text-[13px] [&_td]:text-slate-600 [&_tr]:border-[#EFF3F8]">
                          <TableHeader>
                            <TableRow>
                              <TableHead>N°</TableHead>
                              <TableHead>Cliente</TableHead>
                              <TableHead>Total</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {dashboardSales.map((sale, i) => (
                              <TableRow key={i} className="cursor-pointer hover:bg-[#f8fbff]" onClick={() => setTab('sales')}>
                                <TableCell>#{sale.number}</TableCell>
                                <TableCell>{customerName(sale.customerId)}</TableCell>
                                <TableCell>{brl(sale.total)}</TableCell>
                                <TableCell>
                                  <Badge className="bg-[#ecfdf5] text-[#10b981] border border-[#cffae7] rounded-[10px] hover:bg-[#ecfdf5] font-semibold shadow-none">Pago</Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>

                    <Card className="rounded-[20px] border border-[#e4ebf5] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
                      <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <CardTitle className="text-[16px] font-bold tracking-[-0.02em] text-[#1B2A41]">⚠️ Vencendo</CardTitle>
                        <Button variant="outline" onClick={() => setTab('finance')} className="rounded-[10px] h-8 text-[11px] border-[#e4ebf5] text-slate-500 bg-white shadow-none">Financeiro</Button>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {dashboardDue.map((c, i) => (
                          <button key={i} onClick={() => setTab('finance')} className="w-full border-b border-[#eff3f8] pb-3 last:border-0 last:pb-0 text-left">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="font-semibold text-[13px] text-[#22324A]">{c.desc}</div>
                                <div className="text-[11px] text-[#9AA8BA] mt-1">{c.due}</div>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold text-sm text-slate-700">{brl(c.value)}</div>
                                <div className={`text-xs mt-1 ${c.tone}`}>{c.status}</div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </>
              );
            })()}
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            {(() => {
              const categoryOptions = ['todos', ...new Set(db.products.map((p) => p.category).filter(Boolean))];
              const filtered = db.products.filter((p) => {
                const byText = !productSearch.trim() || [p.name, p.sku, p.category, supplierName(p.supplierId)].join(' ').toLowerCase().includes(productSearch.toLowerCase());
                const byCategory = productCategory === 'todos' || p.category === productCategory;
                return byText && byCategory;
              });
              return (
                <>
                  <SectionHeader
                    title="Produtos"
                    subtitle="Cadastro, estoque, filtro por categoria e ações rápidas"
                    action={
                      <div className="flex flex-wrap gap-2">
                        <Input value={productSearch} onChange={(e) => setProductSearch(e.target.value)} placeholder="Buscar SKU, nome, categoria ou fornecedor" className="w-[290px] rounded-[12px] border-[#E4EBF5] bg-white" />
                        <Select value={productCategory} onValueChange={setProductCategory}>
                          <SelectTrigger className="w-[170px] rounded-[12px] border-[#E4EBF5] bg-white"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {categoryOptions.map((cat) => <SelectItem key={cat} value={cat}>{cat === 'todos' ? 'Todas categorias' : cat}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <Button variant="outline" className="rounded-[12px] border-[#E4EBF5]" onClick={() => { setProductSearch(''); setProductCategory('todos'); }}>Limpar filtros</Button>
                        <Button className="rounded-[12px] bg-[#2453ff] hover:bg-[#1f46d6]" onClick={() => setProductModal(true)}><Plus className="w-4 h-4 mr-2" />Produto</Button>
                      </div>
                    }
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
                    <Card className="rounded-[18px] border border-[#E4EBF5] bg-white shadow-sm"><CardContent className="p-5"><p className="text-[10px] uppercase tracking-[0.18em] text-[#9AA8BA] font-bold">Total produtos</p><p className="text-3xl font-extrabold tracking-[-0.05em] text-[#16243d] mt-2">{db.products.length}</p></CardContent></Card>
                    <Card className="rounded-[18px] border border-[#E4EBF5] bg-white shadow-sm"><CardContent className="p-5"><p className="text-[10px] uppercase tracking-[0.18em] text-[#9AA8BA] font-bold">Filtrados</p><p className="text-3xl font-extrabold tracking-[-0.05em] text-[#16243d] mt-2">{filtered.length}</p></CardContent></Card>
                    <Card className="rounded-[18px] border border-[#E4EBF5] bg-white shadow-sm"><CardContent className="p-5"><p className="text-[10px] uppercase tracking-[0.18em] text-[#9AA8BA] font-bold">Estoque crítico</p><p className="text-3xl font-extrabold tracking-[-0.05em] text-[#ef4444] mt-2">{db.products.filter((p) => p.stock <= p.minStock).length}</p></CardContent></Card>
                    <Card className="rounded-[18px] border border-[#E4EBF5] bg-white shadow-sm"><CardContent className="p-5"><p className="text-[10px] uppercase tracking-[0.18em] text-[#9AA8BA] font-bold">Sem fornecedor</p><p className="text-3xl font-extrabold tracking-[-0.05em] text-[#f59e0b] mt-2">{db.products.filter((p) => !p.supplierId).length}</p></CardContent></Card>
                    <Card className="rounded-[18px] border border-[#E4EBF5] bg-white shadow-sm"><CardContent className="p-5"><p className="text-[10px] uppercase tracking-[0.18em] text-[#9AA8BA] font-bold">Valor estoque</p><p className="text-2xl font-extrabold tracking-[-0.05em] text-[#10b981] mt-2">{brl(db.products.reduce((s,p)=>s+(p.stock*p.cost),0))}</p></CardContent></Card>
                  </div>
                  <Card className="rounded-[20px] border border-[#E4EBF5] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
                    <CardContent className="p-0">
                      <Table className="[&_th]:text-[10px] [&_th]:uppercase [&_th]:tracking-[0.18em] [&_th]:text-[#A0AEC0] [&_th]:font-bold [&_td]:text-[13px] [&_td]:text-slate-600 [&_tr]:border-[#EFF3F8]">
                        <TableHeader>
                          <TableRow>
                            <TableHead>SKU</TableHead>
                            <TableHead>Produto</TableHead>
                            <TableHead>Categoria</TableHead>
                            <TableHead>Fornecedor</TableHead>
                            <TableHead>Custo</TableHead>
                            <TableHead>Venda</TableHead>
                            <TableHead>Margem</TableHead>
                            <TableHead>Estoque</TableHead>
                            <TableHead>Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filtered.length === 0 ? (
                            <TableRow><TableCell colSpan={9} className="text-center py-10 text-slate-400">Nenhum produto encontrado pelos filtros.</TableCell></TableRow>
                          ) : filtered.map((p) => {
                            const margin = p.price > 0 ? (((p.price - p.cost) / p.price) * 100) : 0;
                            const stockBadge = p.stock === 0
                              ? 'bg-[#FFF1F2] text-[#EF4444] border border-[#FECDD3]'
                              : p.stock <= p.minStock
                                ? 'bg-[#FFF7ED] text-[#F59E0B] border border-[#FED7AA]'
                                : 'bg-[#ECFDF5] text-[#10B981] border border-[#CFFAE7]';
                            return (
                              <TableRow key={p.id} className="hover:bg-[#f8fbff]">
                                <TableCell>{p.sku}</TableCell>
                                <TableCell className="font-semibold text-[#22324A]">{p.name}</TableCell>
                                <TableCell>{p.category}</TableCell>
                                <TableCell>{supplierName(p.supplierId)}</TableCell>
                                <TableCell>{brl(p.cost)}</TableCell>
                                <TableCell>{brl(p.price)}</TableCell>
                                <TableCell><span className={`font-semibold ${margin >= 40 ? 'text-[#10B981]' : margin >= 20 ? 'text-[#F59E0B]' : 'text-[#EF4444]'}`}>{margin.toFixed(1)}%</span></TableCell>
                                <TableCell><Badge className={`${stockBadge} rounded-[10px] shadow-none hover:bg-inherit`}>{p.stock} un</Badge></TableCell>
                                <TableCell>
                                  <div className="flex flex-wrap gap-2">
                                    <Button size="sm" variant="outline" className="rounded-[10px] border-[#E4EBF5]" onClick={() => setPurchaseForm((prev) => ({ ...prev, productId: p.id, unitCost: String(p.cost || ''), qty: '1' })) || setPurchaseModal(true)}>Entrada</Button>
                                    <Button size="sm" variant="outline" className="rounded-[10px] border-[#E4EBF5]" onClick={() => { setSearch(p.name); setTab('pdv'); }}>Vender</Button>
                                    <Button size="sm" variant="ghost" className="rounded-[10px] text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => removeItem('products', p.id)}>Excluir</Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </>
              );
            })()}
          </TabsContent>

          <TabsContent value="customers" className="space-y-4">
            <SectionHeader title="Clientes" subtitle="Cadastro para PDV e financeiro" action={<Button className="rounded-2xl" onClick={() => setCustomerModal(true)}>+ Cliente</Button>} />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">{db.customers.map((c) => <Card key={c.id} className="rounded-2xl"><CardContent className="p-5 space-y-2"><div className="flex items-start justify-between gap-3"><div><p className="font-semibold">{c.name}</p><p className="text-sm text-slate-500">{c.city}</p></div><Badge variant="secondary">{c.status}</Badge></div><p className="text-sm text-slate-500">{c.phone || "Sem telefone"}</p><p className="text-sm">Limite: {brl(c.creditLimit)}</p></CardContent></Card>)}</div>
          </TabsContent>

          <TabsContent value="suppliers" className="space-y-4">
            <SectionHeader title="Fornecedores" subtitle="Base para compras e abastecimento" action={<Button className="rounded-2xl" onClick={() => setSupplierModal(true)}>+ Fornecedor</Button>} />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">{db.suppliers.map((s) => <Card key={s.id} className="rounded-2xl"><CardContent className="p-5 space-y-2"><p className="font-semibold">{s.name}</p><p className="text-sm text-slate-500">Contato: {s.contact || "—"}</p><p className="text-sm text-slate-500">Telefone: {s.phone || "—"}</p><Badge variant="secondary">{s.category}</Badge></CardContent></Card>)}</div>
          </TabsContent>

          <TabsContent value="pdv" className="space-y-4">
            <SectionHeader title="PDV" subtitle="Venda rápida com baixa de estoque e fiado" />
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              <Card className="xl:col-span-2 rounded-2xl"><CardHeader><CardTitle>Produtos disponíveis</CardTitle></CardHeader><CardContent><div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">{db.products.map((p) => <button key={p.id} onClick={() => addToCart(p)} className="text-left border rounded-2xl p-4 hover:shadow-md transition bg-white disabled:opacity-50" disabled={p.stock <= 0}><div className="flex items-start justify-between gap-3"><div><p className="font-medium">{p.name}</p><p className="text-sm text-slate-500">{p.sku} · {p.category}</p></div><Badge variant={p.stock <= p.minStock ? "destructive" : "secondary"}>{p.stock}</Badge></div><p className="mt-4 text-lg font-semibold">{brl(p.price)}</p></button>)}</div></CardContent></Card>
              <Card className="rounded-2xl"><CardHeader><CardTitle>Carrinho</CardTitle></CardHeader><CardContent className="space-y-4"><div className="space-y-3">{cart.length === 0 ? <p className="text-sm text-slate-500">Carrinho vazio.</p> : cart.map((item) => <div key={item.productId} className="border rounded-2xl p-3"><div className="flex items-center justify-between gap-2"><div><p className="font-medium text-sm">{item.name}</p><p className="text-xs text-slate-500">{brl(item.price)}</p></div><p className="font-semibold">{brl(item.price * item.qty)}</p></div><div className="flex items-center gap-2 mt-3"><Button variant="outline" size="sm" onClick={() => updateQty(item.productId, -1)}>-</Button><span className="min-w-6 text-center text-sm">{item.qty}</span><Button variant="outline" size="sm" onClick={() => updateQty(item.productId, 1)}>+</Button></div></div>)}</div><div className="space-y-3"><div><Label>Cliente</Label><Select value={customerId} onValueChange={setCustomerId}><SelectTrigger className="rounded-2xl"><SelectValue placeholder="Consumidor Final" /></SelectTrigger><SelectContent>{db.customers.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select></div><div><Label>Pagamento</Label><Select value={paymentMethod} onValueChange={setPaymentMethod}><SelectTrigger className="rounded-2xl"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="PIX">PIX</SelectItem><SelectItem value="Dinheiro">Dinheiro</SelectItem><SelectItem value="Cartão">Cartão</SelectItem><SelectItem value="Fiado">Fiado</SelectItem></SelectContent></Select></div></div><div className="border-t pt-4"><div className="flex items-center justify-between mb-3"><span className="text-sm text-slate-500">Total</span><span className="text-xl font-semibold">{brl(cartTotal)}</span></div><Button className="w-full rounded-2xl" onClick={finalizeSale} disabled={!cart.length}><ShoppingCart className="w-4 h-4 mr-2" />Finalizar venda</Button></div></CardContent></Card>
            </div>
          </TabsContent>

          <TabsContent value="sales" className="space-y-4">
            <SectionHeader title="Vendas" subtitle="Histórico completo do PDV" />
            <Card className="rounded-2xl overflow-hidden"><Table><TableHeader><TableRow><TableHead>Nº</TableHead><TableHead>Data</TableHead><TableHead>Cliente</TableHead><TableHead>Pagamento</TableHead><TableHead>Total</TableHead><TableHead>Itens</TableHead></TableRow></TableHeader><TableBody>{db.sales.length === 0 ? <TableRow><TableCell colSpan={6} className="text-center text-slate-500 py-8">Nenhuma venda registrada.</TableCell></TableRow> : db.sales.map((sale) => <TableRow key={sale.id}><TableCell>#{sale.number}</TableCell><TableCell>{sale.date}</TableCell><TableCell>{customerName(sale.customerId)}</TableCell><TableCell>{sale.paymentMethod}</TableCell><TableCell>{brl(sale.total)}</TableCell><TableCell>{sale.items.reduce((sum, item) => sum + item.qty, 0)}</TableCell></TableRow>)}</TableBody></Table></Card>
          </TabsContent>

          <TabsContent value="purchases" className="space-y-4">
            {(() => {
              const filtered = db.purchases.filter((p) => !purchaseSearch.trim() || [productName(p.productId), supplierName(p.supplierId), p.note || ''].join(' ').toLowerCase().includes(purchaseSearch.toLowerCase()));
              return (
                <>
                  <SectionHeader
                    title="Compras"
                    subtitle="Entrada de estoque, fornecedor vinculado e reflexo no financeiro"
                    action={
                      <div className="flex flex-wrap gap-2">
                        <Input value={purchaseSearch} onChange={(e) => setPurchaseSearch(e.target.value)} placeholder="Buscar produto, fornecedor ou observação" className="w-[290px] rounded-[12px] border-[#E4EBF5] bg-white" />
                        <Button variant="outline" className="rounded-[12px] border-[#E4EBF5]" onClick={() => setPurchaseSearch('')}>Limpar filtro</Button>
                        <Button className="rounded-[12px] bg-[#2453ff] hover:bg-[#1f46d6]" onClick={() => setPurchaseModal(true)}><Truck className="w-4 h-4 mr-2" />Nova compra</Button>
                      </div>
                    }
                  />
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="rounded-[18px] border border-[#E4EBF5] bg-white shadow-sm"><CardContent className="p-5"><p className="text-[10px] uppercase tracking-[0.18em] text-[#9AA8BA] font-bold">Total compras</p><p className="text-3xl font-extrabold tracking-[-0.05em] text-[#16243d] mt-2">{db.purchases.length}</p></CardContent></Card>
                    <Card className="rounded-[18px] border border-[#E4EBF5] bg-white shadow-sm"><CardContent className="p-5"><p className="text-[10px] uppercase tracking-[0.18em] text-[#9AA8BA] font-bold">Valor comprado</p><p className="text-2xl font-extrabold tracking-[-0.05em] text-[#2453ff] mt-2">{brl(db.purchases.reduce((s,p)=>s+p.total,0))}</p></CardContent></Card>
                    <Card className="rounded-[18px] border border-[#E4EBF5] bg-white shadow-sm"><CardContent className="p-5"><p className="text-[10px] uppercase tracking-[0.18em] text-[#9AA8BA] font-bold">Fornecedores ativos</p><p className="text-3xl font-extrabold tracking-[-0.05em] text-[#16243d] mt-2">{db.suppliers.length}</p></CardContent></Card>
                    <Card className="rounded-[18px] border border-[#E4EBF5] bg-white shadow-sm"><CardContent className="p-5"><p className="text-[10px] uppercase tracking-[0.18em] text-[#9AA8BA] font-bold">Filtradas</p><p className="text-3xl font-extrabold tracking-[-0.05em] text-[#10b981] mt-2">{filtered.length}</p></CardContent></Card>
                  </div>
                  <Card className="rounded-[20px] border border-[#E4EBF5] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.03)] overflow-hidden">
                    <Table className="[&_th]:text-[10px] [&_th]:uppercase [&_th]:tracking-[0.18em] [&_th]:text-[#A0AEC0] [&_th]:font-bold [&_td]:text-[13px] [&_td]:text-slate-600 [&_tr]:border-[#EFF3F8]">
                      <TableHeader><TableRow><TableHead>Data</TableHead><TableHead>Produto</TableHead><TableHead>Fornecedor</TableHead><TableHead>Qtd</TableHead><TableHead>Custo Unit.</TableHead><TableHead>Total</TableHead><TableHead>Ações</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {filtered.length === 0 ? <TableRow><TableCell colSpan={7} className="text-center py-10 text-slate-400">Nenhuma compra encontrada.</TableCell></TableRow> : filtered.map((p) => <TableRow key={p.id} className="hover:bg-[#f8fbff]"><TableCell>{p.date}</TableCell><TableCell className="font-semibold text-[#22324A]">{productName(p.productId)}</TableCell><TableCell>{supplierName(p.supplierId)}</TableCell><TableCell>{p.qty}</TableCell><TableCell>{brl(p.unitCost)}</TableCell><TableCell>{brl(p.total)}</TableCell><TableCell><div className="flex gap-2"><Button size="sm" variant="outline" className="rounded-[10px] border-[#E4EBF5]" onClick={() => setTab('finance')}>Financeiro</Button><Button size="sm" variant="outline" className="rounded-[10px] border-[#E4EBF5]" onClick={() => setTab('products')}>Estoque</Button></div></TableCell></TableRow>)}
                      </TableBody>
                    </Table>
                  </Card>
                </>
              );
            })()}
          </TabsContent>

          <TabsContent value="returns" className="space-y-4">
            {(() => {
              const filtered = db.returns.filter((r) => !returnSearch.trim() || [productName(r.productId), String(db.sales.find((s) => s.id === r.saleId)?.number || ''), r.reason || ''].join(' ').toLowerCase().includes(returnSearch.toLowerCase()));
              return (
                <>
                  <SectionHeader
                    title="Devoluções"
                    subtitle="Controle de devolução com recomposição automática de estoque"
                    action={
                      <div className="flex flex-wrap gap-2">
                        <Input value={returnSearch} onChange={(e) => setReturnSearch(e.target.value)} placeholder="Buscar venda, produto ou motivo" className="w-[290px] rounded-[12px] border-[#E4EBF5] bg-white" />
                        <Button variant="outline" className="rounded-[12px] border-[#E4EBF5]" onClick={() => setReturnSearch('')}>Limpar filtro</Button>
                        <Button className="rounded-[12px] bg-[#2453ff] hover:bg-[#1f46d6]" onClick={() => setReturnModal(true)}><Undo2 className="w-4 h-4 mr-2" />Nova devolução</Button>
                      </div>
                    }
                  />
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="rounded-[18px] border border-[#E4EBF5] bg-white shadow-sm"><CardContent className="p-5"><p className="text-[10px] uppercase tracking-[0.18em] text-[#9AA8BA] font-bold">Qtd. devoluções</p><p className="text-3xl font-extrabold tracking-[-0.05em] text-[#16243d] mt-2">{db.returns.length}</p></CardContent></Card>
                    <Card className="rounded-[18px] border border-[#E4EBF5] bg-white shadow-sm"><CardContent className="p-5"><p className="text-[10px] uppercase tracking-[0.18em] text-[#9AA8BA] font-bold">Valor devolvido</p><p className="text-2xl font-extrabold tracking-[-0.05em] text-[#8b5cf6] mt-2">{brl(db.returns.reduce((s,r)=>s+r.total,0))}</p></CardContent></Card>
                    <Card className="rounded-[18px] border border-[#E4EBF5] bg-white shadow-sm"><CardContent className="p-5"><p className="text-[10px] uppercase tracking-[0.18em] text-[#9AA8BA] font-bold">Itens retornados</p><p className="text-3xl font-extrabold tracking-[-0.05em] text-[#2453ff] mt-2">{db.returns.reduce((s,r)=>s+r.qty,0)}</p></CardContent></Card>
                    <Card className="rounded-[18px] border border-[#E4EBF5] bg-white shadow-sm"><CardContent className="p-5"><p className="text-[10px] uppercase tracking-[0.18em] text-[#9AA8BA] font-bold">Filtradas</p><p className="text-3xl font-extrabold tracking-[-0.05em] text-[#10b981] mt-2">{filtered.length}</p></CardContent></Card>
                  </div>
                  <Card className="rounded-[20px] border border-[#E4EBF5] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.03)] overflow-hidden">
                    <Table className="[&_th]:text-[10px] [&_th]:uppercase [&_th]:tracking-[0.18em] [&_th]:text-[#A0AEC0] [&_th]:font-bold [&_td]:text-[13px] [&_td]:text-slate-600 [&_tr]:border-[#EFF3F8]">
                      <TableHeader><TableRow><TableHead>Data</TableHead><TableHead>Venda</TableHead><TableHead>Produto</TableHead><TableHead>Qtd</TableHead><TableHead>Total</TableHead><TableHead>Motivo</TableHead><TableHead>Ações</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {filtered.length === 0 ? <TableRow><TableCell colSpan={7} className="text-center py-10 text-slate-400">Nenhuma devolução encontrada.</TableCell></TableRow> : filtered.map((r) => <TableRow key={r.id} className="hover:bg-[#f8fbff]"><TableCell>{r.date}</TableCell><TableCell>#{db.sales.find((s) => s.id === r.saleId)?.number || '—'}</TableCell><TableCell className="font-semibold text-[#22324A]">{productName(r.productId)}</TableCell><TableCell>{r.qty}</TableCell><TableCell>{brl(r.total)}</TableCell><TableCell>{r.reason || '—'}</TableCell><TableCell><div className="flex gap-2"><Button size="sm" variant="outline" className="rounded-[10px] border-[#E4EBF5]" onClick={() => setTab('products')}>Estoque</Button><Button size="sm" variant="outline" className="rounded-[10px] border-[#E4EBF5]" onClick={() => setTab('sales')}>Venda</Button></div></TableCell></TableRow>)}
                      </TableBody>
                    </Table>
                  </Card>
                </>
              );
            })()}
          </TabsContent>

          <TabsContent value="finance" className="space-y-4">
            {(() => {
              const current = financeMode === 'receber' ? db.receivables : db.payables;
              const filtered = current.filter((item) => !financeSearch.trim() || [item.description, item.supplier || '', customerName(item.customerId), item.dueDate || '', item.status || ''].join(' ').toLowerCase().includes(financeSearch.toLowerCase()));
              return (
                <>
                  <SectionHeader
                    title="Financeiro"
                    subtitle="Receber, pagar, baixar títulos e navegar sem ruído"
                    action={
                      <div className="flex flex-wrap gap-2">
                        <Input value={financeSearch} onChange={(e) => setFinanceSearch(e.target.value)} placeholder="Buscar descrição, cliente, fornecedor ou vencimento" className="w-[320px] rounded-[12px] border-[#E4EBF5] bg-white" />
                        <Button variant="outline" className="rounded-[12px] border-[#E4EBF5]" onClick={() => setFinanceSearch('')}>Limpar filtro</Button>
                        <Button variant="outline" className={`rounded-[12px] border-[#E4EBF5] ${financeMode==='receber' ? 'bg-[#EEF4FF] text-[#2453FF]' : ''}`} onClick={() => setFinanceMode('receber')}>A receber</Button>
                        <Button variant="outline" className={`rounded-[12px] border-[#E4EBF5] ${financeMode==='pagar' ? 'bg-[#FFF1F2] text-[#EF4444]' : ''}`} onClick={() => setFinanceMode('pagar')}>A pagar</Button>
                        <Button className="rounded-[12px] bg-[#2453ff] hover:bg-[#1f46d6]" onClick={() => financeMode === 'receber' ? setReceivableModal(true) : setPayableModal(true)}>{financeMode === 'receber' ? '+ Receber' : '+ Pagar'}</Button>
                      </div>
                    }
                  />
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="rounded-[18px] border border-[#E4EBF5] bg-white shadow-sm"><CardContent className="p-5"><p className="text-[10px] uppercase tracking-[0.18em] text-[#9AA8BA] font-bold">A receber</p><p className="text-2xl font-extrabold tracking-[-0.05em] text-[#10b981] mt-2">{brl(db.receivables.filter((i)=>i.status==='Aberto').reduce((s,i)=>s+i.amount,0))}</p></CardContent></Card>
                    <Card className="rounded-[18px] border border-[#E4EBF5] bg-white shadow-sm"><CardContent className="p-5"><p className="text-[10px] uppercase tracking-[0.18em] text-[#9AA8BA] font-bold">A pagar</p><p className="text-2xl font-extrabold tracking-[-0.05em] text-[#ef4444] mt-2">{brl(db.payables.filter((i)=>i.status==='Aberto').reduce((s,i)=>s+i.amount,0))}</p></CardContent></Card>
                    <Card className="rounded-[18px] border border-[#E4EBF5] bg-white shadow-sm"><CardContent className="p-5"><p className="text-[10px] uppercase tracking-[0.18em] text-[#9AA8BA] font-bold">Em aberto</p><p className="text-3xl font-extrabold tracking-[-0.05em] text-[#16243d] mt-2">{current.filter((i)=>i.status==='Aberto').length}</p></CardContent></Card>
                    <Card className="rounded-[18px] border border-[#E4EBF5] bg-white shadow-sm"><CardContent className="p-5"><p className="text-[10px] uppercase tracking-[0.18em] text-[#9AA8BA] font-bold">Filtrados</p><p className="text-3xl font-extrabold tracking-[-0.05em] text-[#2453ff] mt-2">{filtered.length}</p></CardContent></Card>
                  </div>
                  <Card className="rounded-[20px] border border-[#E4EBF5] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.03)] overflow-hidden">
                    <Table className="[&_th]:text-[10px] [&_th]:uppercase [&_th]:tracking-[0.18em] [&_th]:text-[#A0AEC0] [&_th]:font-bold [&_td]:text-[13px] [&_td]:text-slate-600 [&_tr]:border-[#EFF3F8]">
                      <TableHeader><TableRow><TableHead>Descrição</TableHead><TableHead>{financeMode === 'receber' ? 'Cliente' : 'Fornecedor'}</TableHead><TableHead>Vencimento</TableHead><TableHead>Valor</TableHead><TableHead>Status</TableHead><TableHead>Ações</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {filtered.length === 0 ? <TableRow><TableCell colSpan={6} className="text-center py-10 text-slate-400">Nenhum título encontrado.</TableCell></TableRow> : filtered.map((item) => <TableRow key={item.id} className="hover:bg-[#f8fbff]"><TableCell className="font-semibold text-[#22324A]">{item.description}</TableCell><TableCell>{financeMode === 'receber' ? customerName(item.customerId) : (item.supplier || '—')}</TableCell><TableCell>{item.dueDate}</TableCell><TableCell>{brl(item.amount)}</TableCell><TableCell><Badge className={`${item.status === 'Pago' ? 'bg-[#ECFDF5] text-[#10B981] border border-[#CFFAE7]' : 'bg-[#EEF4FF] text-[#2453FF] border border-[#DCE6FF]'} rounded-[10px] shadow-none hover:bg-inherit`}>{item.status}</Badge></TableCell><TableCell><div className="flex flex-wrap gap-2">{item.status === 'Aberto' && <Button size="sm" variant="outline" className="rounded-[10px] border-[#E4EBF5]" onClick={() => markPaid(financeMode === 'receber' ? 'receivables' : 'payables', item.id)}>Baixar</Button>}<Button size="sm" variant="outline" className="rounded-[10px] border-[#E4EBF5]" onClick={() => setTab(financeMode === 'receber' ? 'customers' : 'purchases')}>{financeMode === 'receber' ? 'Cliente' : 'Origem'}</Button><Button size="sm" variant="ghost" className="rounded-[10px] text-red-500 hover:bg-red-50" onClick={() => removeItem(financeMode === 'receber' ? 'receivables' : 'payables', item.id)}>Excluir</Button></div></TableCell></TableRow>)}
                      </TableBody>
                    </Table>
                  </Card>
                </>
              );
            })()}
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            {(() => {
              const salesCount = db.sales.length;
              const salesTotal = reportData.salesTotal;
              const purchaseTotal = reportData.purchaseTotal;
              const returnTotal = reportData.returns;
              const avgTicket = salesCount ? salesTotal / salesCount : 0;
              const grossMarginPct = salesTotal > 0 ? ((salesTotal - purchaseTotal) / salesTotal) * 100 : 0;
              const openReceivables = db.receivables.filter((i) => i.status === 'Aberto');
              const openPayables = db.payables.filter((i) => i.status === 'Aberto');
              const overdueReceivables = openReceivables.filter((i) => i.dueDate && i.dueDate < todayISO());
              const overduePayables = openPayables.filter((i) => i.dueDate && i.dueDate < todayISO());
              const lowStockProducts = db.products.filter((p) => p.stock <= p.minStock);
              const topProducts = [...db.sales.flatMap((s) => s.items || [])]
                .reduce((acc, item) => {
                  const prev = acc[item.productId] || { productId: item.productId, qty: 0, revenue: 0 };
                  prev.qty += item.qty;
                  prev.revenue += item.qty * item.price;
                  acc[item.productId] = prev;
                  return acc;
                }, {}) ;
              const topProductsList = Object.values(topProducts)
                .sort((a, b) => b.revenue - a.revenue)
                .slice(0, 5);
              const customerSales = db.sales.reduce((acc, sale) => {
                const key = sale.customerId || 'cf';
                acc[key] = (acc[key] || 0) + sale.total;
                return acc;
              }, {});
              const topCustomers = Object.entries(customerSales)
                .map(([id, total]) => ({ id, total }))
                .sort((a, b) => b.total - a.total)
                .slice(0, 5);
              const reportCards = {
                geral: [
                  { label: 'Venda acumulada', value: brl(salesTotal), tone: 'text-[#2453FF]', action: () => setTab('sales') },
                  { label: 'Compras acumuladas', value: brl(purchaseTotal), tone: 'text-[#8B5CF6]', action: () => setTab('purchases') },
                  { label: 'Margem bruta', value: brl(reportData.margin), tone: grossMarginPct >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]', action: () => setTab('finance') },
                  { label: 'Devoluções', value: brl(returnTotal), tone: 'text-[#F59E0B]', action: () => setTab('returns') },
                ],
                comercial: [
                  { label: 'Clientes', value: String(db.customers.length), tone: 'text-[#2453FF]', action: () => setTab('customers') },
                  { label: 'Vendas', value: String(salesCount), tone: 'text-[#10B981]', action: () => setTab('sales') },
                  { label: 'Ticket médio', value: brl(avgTicket), tone: 'text-[#F59E0B]', action: () => setTab('sales') },
                  { label: 'Produtos ativos', value: String(db.products.length), tone: 'text-[#8B5CF6]', action: () => setTab('products') },
                ],
                financeiro: [
                  { label: 'A receber', value: brl(openReceivables.reduce((s,i)=>s+i.amount,0)), tone: 'text-[#10B981]', action: () => setTab('finance') },
                  { label: 'A pagar', value: brl(openPayables.reduce((s,i)=>s+i.amount,0)), tone: 'text-[#EF4444]', action: () => setTab('finance') },
                  { label: 'Saldo projetado', value: brl(openReceivables.reduce((s,i)=>s+i.amount,0)-openPayables.reduce((s,i)=>s+i.amount,0)), tone: 'text-[#2453FF]', action: () => setTab('finance') },
                  { label: 'Títulos vencidos', value: String(overdueReceivables.length + overduePayables.length), tone: 'text-[#F59E0B]', action: () => setTab('finance') },
                ]
              };
              const cards = reportCards[reportFilter] || reportCards.geral;
              return (
                <>
                  <SectionHeader
                    title="Relatórios Executivos"
                    subtitle="Painel gerencial com leitura comercial, financeira e operacional"
                    action={
                      <div className="flex gap-2 flex-wrap">
                        {['geral','comercial','financeiro'].map((f) => <Button key={f} variant="outline" className={`rounded-[12px] border-[#E4EBF5] ${reportFilter===f ? 'bg-[#EEF4FF] text-[#2453FF]' : ''}`} onClick={() => setReportFilter(f)}>{f.charAt(0).toUpperCase()+f.slice(1)}</Button>)}
                      </div>
                    }
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    {cards.map((c) => (
                      <button key={c.label} onClick={c.action} className="text-left">
                        <Card className="rounded-[18px] border border-[#E4EBF5] bg-white shadow-sm hover:shadow-md transition">
                          <CardContent className="p-5">
                            <p className="text-[10px] uppercase tracking-[0.18em] text-[#9AA8BA] font-bold">{c.label}</p>
                            <p className={`text-2xl font-extrabold tracking-[-0.05em] mt-2 ${c.tone}`}>{c.value}</p>
                            <p className="text-xs text-slate-400 mt-2">Clique para abrir o módulo</p>
                          </CardContent>
                        </Card>
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                    <Card className="rounded-[20px] border border-[#E4EBF5] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
                      <CardHeader><CardTitle className="text-[16px] font-bold tracking-[-0.02em] text-[#1B2A41]">DRE Gerencial Resumida</CardTitle></CardHeader>
                      <CardContent className="space-y-3 text-sm">
                        {[
                          ['Receita bruta', salesTotal, 'text-[#2453FF]'],
                          ['(-) Devoluções', returnTotal, 'text-[#F59E0B]'],
                          ['Receita líquida', salesTotal - returnTotal, 'text-[#16243d]'],
                          ['(-) Compras / CMV base', purchaseTotal, 'text-[#8B5CF6]'],
                          ['Margem bruta', reportData.margin - returnTotal, (reportData.margin - returnTotal) >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'],
                        ].map(([label, value, tone], idx) => (
                          <div key={label} className={`flex items-center justify-between ${idx < 4 ? 'border-b border-[#EFF3F8] pb-3' : ''}`}>
                            <span className="text-slate-500">{label}</span>
                            <span className={`font-bold ${tone}`}>{brl(value)}</span>
                          </div>
                        ))}
                        <div className="pt-2 border-t border-[#E4EBF5] flex items-center justify-between">
                          <span className="text-slate-500">Margem %</span>
                          <span className={`font-bold ${grossMarginPct >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>{grossMarginPct.toFixed(1)}%</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="rounded-[20px] border border-[#E4EBF5] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
                      <CardHeader><CardTitle className="text-[16px] font-bold tracking-[-0.02em] text-[#1B2A41]">Top Produtos por Receita</CardTitle></CardHeader>
                      <CardContent className="space-y-3">
                        {topProductsList.length === 0 ? <p className="text-sm text-slate-400">Sem vendas suficientes para ranking.</p> : topProductsList.map((item, idx) => (
                          <button key={item.productId} onClick={() => setTab('products')} className="w-full text-left rounded-[12px] border border-[#EFF3F8] p-4 hover:bg-[#f8fbff]">
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <p className="text-sm font-semibold text-[#22324A]">{idx + 1}. {productName(item.productId)}</p>
                                <p className="text-xs text-slate-400 mt-1">{item.qty} unidade(s)</p>
                              </div>
                              <p className="font-bold text-[#2453FF]">{brl(item.revenue)}</p>
                            </div>
                          </button>
                        ))}
                      </CardContent>
                    </Card>

                    <Card className="rounded-[20px] border border-[#E4EBF5] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
                      <CardHeader><CardTitle className="text-[16px] font-bold tracking-[-0.02em] text-[#1B2A41]">Top Clientes por Faturamento</CardTitle></CardHeader>
                      <CardContent className="space-y-3">
                        {topCustomers.length === 0 ? <p className="text-sm text-slate-400">Sem base suficiente para ranking.</p> : topCustomers.map((item, idx) => (
                          <button key={item.id} onClick={() => setTab('customers')} className="w-full text-left rounded-[12px] border border-[#EFF3F8] p-4 hover:bg-[#f8fbff]">
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <p className="text-sm font-semibold text-[#22324A]">{idx + 1}. {item.id === 'cf' ? 'Consumidor Final' : customerName(item.id)}</p>
                                <p className="text-xs text-slate-400 mt-1">Carteira comercial</p>
                              </div>
                              <p className="font-bold text-[#10B981]">{brl(item.total)}</p>
                            </div>
                          </button>
                        ))}
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    <Card className="rounded-[20px] border border-[#E4EBF5] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
                      <CardHeader><CardTitle className="text-[16px] font-bold tracking-[-0.02em] text-[#1B2A41]">Riscos e Alertas Operacionais</CardTitle></CardHeader>
                      <CardContent className="space-y-3 text-sm text-slate-600">
                        <button onClick={() => setTab('products')} className="w-full text-left rounded-[12px] border border-[#EFF3F8] p-4 hover:bg-[#f8fbff]">Produtos com estoque crítico: <span className="font-semibold text-[#EF4444]">{lowStockProducts.length}</span></button>
                        <button onClick={() => setTab('finance')} className="w-full text-left rounded-[12px] border border-[#EFF3F8] p-4 hover:bg-[#f8fbff]">Contas a receber vencidas: <span className="font-semibold text-[#F59E0B]">{overdueReceivables.length}</span></button>
                        <button onClick={() => setTab('finance')} className="w-full text-left rounded-[12px] border border-[#EFF3F8] p-4 hover:bg-[#f8fbff]">Contas a pagar vencidas: <span className="font-semibold text-[#EF4444]">{overduePayables.length}</span></button>
                        <button onClick={() => setTab('returns')} className="w-full text-left rounded-[12px] border border-[#EFF3F8] p-4 hover:bg-[#f8fbff]">Devoluções registradas: <span className="font-semibold text-[#8B5CF6]">{db.returns.length}</span></button>
                      </CardContent>
                    </Card>

                    <Card className="rounded-[20px] border border-[#E4EBF5] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
                      <CardHeader><CardTitle className="text-[16px] font-bold tracking-[-0.02em] text-[#1B2A41]">Resumo Analítico</CardTitle></CardHeader>
                      <CardContent className="space-y-3 text-sm text-slate-600">
                        <button onClick={() => setTab('sales')} className="w-full text-left rounded-[12px] border border-[#EFF3F8] p-4 hover:bg-[#f8fbff]">Vendas registradas: <span className="font-semibold">{salesCount}</span></button>
                        <button onClick={() => setTab('customers')} className="w-full text-left rounded-[12px] border border-[#EFF3F8] p-4 hover:bg-[#f8fbff]">Base de clientes: <span className="font-semibold">{db.customers.length}</span></button>
                        <button onClick={() => setTab('admin')} className="w-full text-left rounded-[12px] border border-[#EFF3F8] p-4 hover:bg-[#f8fbff]">Usuários do sistema: <span className="font-semibold">{db.users.length}</span></button>
                        <button onClick={() => setTab('purchases')} className="w-full text-left rounded-[12px] border border-[#EFF3F8] p-4 hover:bg-[#f8fbff]">Compras lançadas: <span className="font-semibold">{db.purchases.length}</span></button>
                      </CardContent>
                    </Card>
                  </div>
                </>
              );
            })()}
          </TabsContent>

          <TabsContent value="chat" className="space-y-4">
            <SectionHeader title="Chat interno" subtitle="Comunicação simples entre usuários" action={<Button variant="outline" className="rounded-2xl" onClick={() => updateDb((prev) => ({ ...prev, chatThreads: [{ id: crypto.randomUUID(), title: `Canal ${prev.chatThreads.length + 1}`, messages: [] }, ...prev.chatThreads] }), { action: "Criou canal", module: "Chat", detail: "Novo canal" })}>+ Canal</Button>} />
            <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr] gap-4">
              <Card className="rounded-2xl"><CardHeader><CardTitle>Canais</CardTitle></CardHeader><CardContent className="space-y-2">{db.chatThreads.map((thread) => <button key={thread.id} onClick={() => setSelectedThreadId(thread.id)} className={`w-full text-left border rounded-2xl p-3 ${selectedThreadId === thread.id ? "bg-slate-100" : "bg-white"}`}><p className="font-medium text-sm">{thread.title}</p><p className="text-xs text-slate-500">{thread.messages.length} mensagem(ns)</p></button>)}</CardContent></Card>
              <Card className="rounded-2xl"><CardHeader><CardTitle>{activeThread?.title || "Canal"}</CardTitle></CardHeader><CardContent className="space-y-4"><ScrollArea className="h-[320px] pr-3"><div className="space-y-3">{activeThread?.messages?.length ? activeThread.messages.map((m) => <div key={m.id} className="border rounded-2xl p-3"><div className="flex items-center justify-between gap-2"><p className="font-medium text-sm">{m.sender}</p><p className="text-xs text-slate-500">{new Date(m.at).toLocaleString("pt-BR")}</p></div><p className="text-sm text-slate-700 mt-2">{m.text}</p></div>) : <p className="text-sm text-slate-500">Sem mensagens.</p>}</div></ScrollArea><div className="flex gap-2"><Textarea value={chatMessage} onChange={(e) => setChatMessage(e.target.value)} placeholder="Digite uma mensagem" className="rounded-2xl" /><Button className="rounded-2xl" onClick={sendChatMessage}><MessageSquare className="w-4 h-4 mr-2" />Enviar</Button></div></CardContent></Card>
            </div>
          </TabsContent>

          <TabsContent value="admin" className="space-y-4">
            <SectionHeader
              title="Administração do Sistema"
              subtitle="Permissões, usuários, logs e backup em uma camada coerente"
              action={
                <div className="flex gap-2 flex-wrap">
                  {[
                    ['users','Usuários'],
                    ['permissions','Permissões'],
                    ['logs','Logs'],
                    ['backup','Backup'],
                  ].map(([key,label]) => <Button key={key} variant="outline" className={`rounded-[12px] border-[#E4EBF5] ${adminView===key ? 'bg-[#EEF4FF] text-[#2453FF]' : ''}`} onClick={() => setAdminView(key)}>{label}</Button>)}
                  <Button className="rounded-[12px] bg-[#2453ff] hover:bg-[#1f46d6]" onClick={() => setUserModal(true)}><Plus className="w-4 h-4 mr-2" />Usuário</Button>
                </div>
              }
            />
            {adminView === 'users' && (
              <Card className="rounded-[20px] border border-[#E4EBF5] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.03)]"><CardContent className="p-0"><Table className="[&_th]:text-[10px] [&_th]:uppercase [&_th]:tracking-[0.18em] [&_th]:text-[#A0AEC0] [&_th]:font-bold [&_td]:text-[13px] [&_td]:text-slate-600 [&_tr]:border-[#EFF3F8]"><TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>E-mail</TableHead><TableHead>Perfil</TableHead><TableHead>Status</TableHead><TableHead>Ações</TableHead></TableRow></TableHeader><TableBody>{db.users.map((u) => <TableRow key={u.id} className="hover:bg-[#f8fbff]"><TableCell className="font-semibold text-[#22324A]">{u.name}</TableCell><TableCell>{u.email}</TableCell><TableCell>{u.role}</TableCell><TableCell><Badge className={`${u.status === 'Ativo' ? 'bg-[#ECFDF5] text-[#10B981] border border-[#CFFAE7]' : 'bg-[#FFF1F2] text-[#EF4444] border border-[#FECDD3]'} rounded-[10px] shadow-none hover:bg-inherit`}>{u.status}</Badge></TableCell><TableCell><div className="flex gap-2"><Button size="sm" variant="outline" className="rounded-[10px] border-[#E4EBF5]" onClick={() => setAdminView('permissions')}>Permissões</Button><Button size="sm" variant="ghost" className="rounded-[10px] text-red-500 hover:bg-red-50" onClick={() => removeItem('users', u.id)}>Excluir</Button></div></TableCell></TableRow>)}</TableBody></Table></CardContent></Card>
            )}
            {adminView === 'permissions' && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">{db.permissions.map((p) => <Card key={p.role} className="rounded-[20px] border border-[#E4EBF5] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.03)]"><CardContent className="p-5"><div className="flex items-center justify-between mb-3"><p className="font-bold text-[#1B2A41]">{p.role}</p><Button size="sm" variant="outline" className="rounded-[10px] border-[#E4EBF5]" onClick={() => setAdminView('users')}>Ver usuários</Button></div><div className="flex flex-wrap gap-2">{p.modules.map((m) => <Badge key={m} variant="outline" className="rounded-[10px] border-[#DCE6FF] text-[#2453FF] bg-[#EEF4FF]">{m}</Badge>)}</div></CardContent></Card>)}</div>
            )}
            {adminView === 'logs' && (
              <Card className="rounded-[20px] border border-[#E4EBF5] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.03)]"><CardHeader className="flex flex-row items-center justify-between"><CardTitle className="text-[16px] font-bold tracking-[-0.02em] text-[#1B2A41]">Logs do sistema</CardTitle><Button variant="outline" className="rounded-[12px] border-[#E4EBF5]" onClick={() => updateDb((prev) => ({ ...prev, logs: [] }), { action: 'Limpou logs', module: 'Logs', detail: 'Todos' })}>Limpar logs</Button></CardHeader><CardContent className="space-y-3">{db.logs.length === 0 ? <p className="text-sm text-slate-400">Sem logs.</p> : db.logs.map((log) => <div key={log.id} className="rounded-[14px] border border-[#EFF3F8] p-4"><div className="flex items-center justify-between gap-3"><p className="font-semibold text-[#22324A]">{log.action}</p><Badge variant="outline" className="rounded-[10px] border-[#E4EBF5]">{log.module}</Badge></div><p className="text-sm text-slate-600 mt-2">{log.detail}</p><p className="text-xs text-slate-400 mt-2">{new Date(log.at).toLocaleString('pt-BR')}</p></div>)}</CardContent></Card>
            )}
            {adminView === 'backup' && (
              <Card className="rounded-[20px] border border-[#E4EBF5] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.03)]"><CardHeader><CardTitle className="text-[16px] font-bold tracking-[-0.02em] text-[#1B2A41]">Backups</CardTitle></CardHeader><CardContent className="space-y-4"><div className="flex gap-2 flex-wrap"><Button className="rounded-[12px] bg-[#2453ff] hover:bg-[#1f46d6]" onClick={createBackup}><Download className="w-4 h-4 mr-2" />Gerar backup</Button><label className="inline-flex items-center"><input type="file" accept="application/json" className="hidden" onChange={importBackup} /><span className="inline-flex items-center rounded-[12px] border border-[#E4EBF5] px-4 py-2 text-sm cursor-pointer bg-white"><Upload className="w-4 h-4 mr-2" />Importar</span></label></div><div className="space-y-3">{db.backups.length === 0 ? <p className="text-sm text-slate-400">Nenhum backup gerado.</p> : db.backups.map((b) => <div key={b.id} className="rounded-[14px] border border-[#EFF3F8] p-4 flex items-center justify-between gap-3"><div><p className="font-semibold text-[#22324A]">{b.label}</p><p className="text-xs text-slate-400 mt-1">{new Date(b.at).toLocaleString('pt-BR')} · {b.size} bytes</p></div><Button size="sm" variant="outline" className="rounded-[10px] border-[#E4EBF5]" onClick={createBackup}>Novo</Button></div>)}</div></CardContent></Card>
            )}
          </TabsContent>
        </Tabs>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Dialog open={productModal} onOpenChange={setProductModal}><DialogContent className="rounded-3xl"><DialogHeader><DialogTitle>Novo produto</DialogTitle></DialogHeader><div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2"><div><Label>SKU</Label><Input value={productForm.sku} onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })} className="rounded-2xl" /></div><div><Label>Categoria</Label><Select value={productForm.category} onValueChange={(value) => setProductForm({ ...productForm, category: value })}><SelectTrigger className="rounded-2xl"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Lingerie">Lingerie</SelectItem><SelectItem value="Joias">Joias</SelectItem><SelectItem value="Acessórios">Acessórios</SelectItem></SelectContent></Select></div><div className="md:col-span-2"><Label>Nome</Label><Input value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} className="rounded-2xl" /></div><div><Label>Fornecedor</Label><Select value={productForm.supplierId} onValueChange={(value) => setProductForm({ ...productForm, supplierId: value })}><SelectTrigger className="rounded-2xl"><SelectValue placeholder="Opcional" /></SelectTrigger><SelectContent>{db.suppliers.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent></Select></div><div><Label>Custo</Label><Input type="number" value={productForm.cost} onChange={(e) => setProductForm({ ...productForm, cost: e.target.value })} className="rounded-2xl" /></div><div><Label>Preço</Label><Input type="number" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} className="rounded-2xl" /></div><div><Label>Estoque inicial</Label><Input type="number" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} className="rounded-2xl" /></div><div><Label>Estoque mínimo</Label><Input type="number" value={productForm.minStock} onChange={(e) => setProductForm({ ...productForm, minStock: e.target.value })} className="rounded-2xl" /></div></div><DialogFooter><Button className="rounded-2xl" onClick={addProduct}>Salvar produto</Button></DialogFooter></DialogContent></Dialog>
      <Dialog open={customerModal} onOpenChange={setCustomerModal}><DialogContent className="rounded-3xl"><DialogHeader><DialogTitle>Novo cliente</DialogTitle></DialogHeader><div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2"><div className="md:col-span-2"><Label>Nome</Label><Input value={customerForm.name} onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })} className="rounded-2xl" /></div><div><Label>Telefone</Label><Input value={customerForm.phone} onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })} className="rounded-2xl" /></div><div><Label>Cidade</Label><Input value={customerForm.city} onChange={(e) => setCustomerForm({ ...customerForm, city: e.target.value })} className="rounded-2xl" /></div><div><Label>Limite de fiado</Label><Input type="number" value={customerForm.creditLimit} onChange={(e) => setCustomerForm({ ...customerForm, creditLimit: e.target.value })} className="rounded-2xl" /></div><div><Label>Status</Label><Select value={customerForm.status} onValueChange={(value) => setCustomerForm({ ...customerForm, status: value })}><SelectTrigger className="rounded-2xl"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Ativo">Ativo</SelectItem><SelectItem value="Inativo">Inativo</SelectItem></SelectContent></Select></div></div><DialogFooter><Button className="rounded-2xl" onClick={addCustomer}>Salvar cliente</Button></DialogFooter></DialogContent></Dialog>
      <Dialog open={supplierModal} onOpenChange={setSupplierModal}><DialogContent className="rounded-3xl"><DialogHeader><DialogTitle>Novo fornecedor</DialogTitle></DialogHeader><div className="grid gap-4 py-2"><div><Label>Nome</Label><Input value={supplierForm.name} onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })} className="rounded-2xl" /></div><div><Label>Contato</Label><Input value={supplierForm.contact} onChange={(e) => setSupplierForm({ ...supplierForm, contact: e.target.value })} className="rounded-2xl" /></div><div><Label>Telefone</Label><Input value={supplierForm.phone} onChange={(e) => setSupplierForm({ ...supplierForm, phone: e.target.value })} className="rounded-2xl" /></div><div><Label>Categoria</Label><Input value={supplierForm.category} onChange={(e) => setSupplierForm({ ...supplierForm, category: e.target.value })} className="rounded-2xl" /></div></div><DialogFooter><Button className="rounded-2xl" onClick={addSupplier}>Salvar fornecedor</Button></DialogFooter></DialogContent></Dialog>
      <Dialog open={userModal} onOpenChange={setUserModal}><DialogContent className="rounded-3xl"><DialogHeader><DialogTitle>Novo usuário</DialogTitle></DialogHeader><div className="grid gap-4 py-2"><div><Label>Nome</Label><Input value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} className="rounded-2xl" /></div><div><Label>E-mail</Label><Input value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} className="rounded-2xl" /></div><div><Label>Perfil</Label><Select value={userForm.role} onValueChange={(value) => setUserForm({ ...userForm, role: value })}><SelectTrigger className="rounded-2xl"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Administrador">Administrador</SelectItem><SelectItem value="Vendedor">Vendedor</SelectItem><SelectItem value="Financeiro">Financeiro</SelectItem></SelectContent></Select></div><div><Label>Status</Label><Select value={userForm.status} onValueChange={(value) => setUserForm({ ...userForm, status: value })}><SelectTrigger className="rounded-2xl"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Ativo">Ativo</SelectItem><SelectItem value="Inativo">Inativo</SelectItem></SelectContent></Select></div></div><DialogFooter><Button className="rounded-2xl" onClick={addUser}>Salvar usuário</Button></DialogFooter></DialogContent></Dialog>
      <Dialog open={payableModal} onOpenChange={setPayableModal}><DialogContent className="rounded-3xl"><DialogHeader><DialogTitle>Nova conta a pagar</DialogTitle></DialogHeader><div className="grid gap-4 py-2"><div><Label>Descrição</Label><Input value={payableForm.description} onChange={(e) => setPayableForm({ ...payableForm, description: e.target.value })} className="rounded-2xl" /></div><div><Label>Fornecedor</Label><Input value={payableForm.supplier} onChange={(e) => setPayableForm({ ...payableForm, supplier: e.target.value })} className="rounded-2xl" /></div><div><Label>Valor</Label><Input type="number" value={payableForm.amount} onChange={(e) => setPayableForm({ ...payableForm, amount: e.target.value })} className="rounded-2xl" /></div><div><Label>Vencimento</Label><Input type="date" value={payableForm.dueDate} onChange={(e) => setPayableForm({ ...payableForm, dueDate: e.target.value })} className="rounded-2xl" /></div></div><DialogFooter><Button className="rounded-2xl" onClick={addPayable}>Salvar conta</Button></DialogFooter></DialogContent></Dialog>
      <Dialog open={receivableModal} onOpenChange={setReceivableModal}><DialogContent className="rounded-3xl"><DialogHeader><DialogTitle>Nova conta a receber</DialogTitle></DialogHeader><div className="grid gap-4 py-2"><div><Label>Descrição</Label><Input value={receivableForm.description} onChange={(e) => setReceivableForm({ ...receivableForm, description: e.target.value })} className="rounded-2xl" /></div><div><Label>Cliente</Label><Select value={receivableForm.customerId} onValueChange={(value) => setReceivableForm({ ...receivableForm, customerId: value })}><SelectTrigger className="rounded-2xl"><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{db.customers.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select></div><div><Label>Valor</Label><Input type="number" value={receivableForm.amount} onChange={(e) => setReceivableForm({ ...receivableForm, amount: e.target.value })} className="rounded-2xl" /></div><div><Label>Vencimento</Label><Input type="date" value={receivableForm.dueDate} onChange={(e) => setReceivableForm({ ...receivableForm, dueDate: e.target.value })} className="rounded-2xl" /></div></div><DialogFooter><Button className="rounded-2xl" onClick={addReceivable}>Salvar conta</Button></DialogFooter></DialogContent></Dialog>
      <Dialog open={purchaseModal} onOpenChange={setPurchaseModal}><DialogContent className="rounded-3xl"><DialogHeader><DialogTitle>Nova compra</DialogTitle></DialogHeader><div className="grid gap-4 py-2"><div><Label>Fornecedor</Label><Select value={purchaseForm.supplierId} onValueChange={(value) => setPurchaseForm({ ...purchaseForm, supplierId: value })}><SelectTrigger className="rounded-2xl"><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{db.suppliers.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent></Select></div><div><Label>Produto</Label><Select value={purchaseForm.productId} onValueChange={(value) => setPurchaseForm({ ...purchaseForm, productId: value })}><SelectTrigger className="rounded-2xl"><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{db.products.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent></Select></div><div><Label>Quantidade</Label><Input type="number" value={purchaseForm.qty} onChange={(e) => setPurchaseForm({ ...purchaseForm, qty: e.target.value })} className="rounded-2xl" /></div><div><Label>Custo unitário</Label><Input type="number" value={purchaseForm.unitCost} onChange={(e) => setPurchaseForm({ ...purchaseForm, unitCost: e.target.value })} className="rounded-2xl" /></div><div><Label>Observação</Label><Textarea value={purchaseForm.note} onChange={(e) => setPurchaseForm({ ...purchaseForm, note: e.target.value })} className="rounded-2xl" /></div></div><DialogFooter><Button className="rounded-2xl" onClick={addPurchase}>Salvar compra</Button></DialogFooter></DialogContent></Dialog>
      <Dialog open={returnModal} onOpenChange={setReturnModal}><DialogContent className="rounded-3xl"><DialogHeader><DialogTitle>Nova devolução</DialogTitle></DialogHeader><div className="grid gap-4 py-2"><div><Label>Venda</Label><Select value={returnForm.saleId} onValueChange={(value) => setReturnForm({ ...returnForm, saleId: value })}><SelectTrigger className="rounded-2xl"><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{db.sales.map((s) => <SelectItem key={s.id} value={s.id}>Venda #{s.number}</SelectItem>)}</SelectContent></Select></div><div><Label>Produto</Label><Select value={returnForm.productId} onValueChange={(value) => setReturnForm({ ...returnForm, productId: value })}><SelectTrigger className="rounded-2xl"><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{db.products.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent></Select></div><div><Label>Quantidade</Label><Input type="number" value={returnForm.qty} onChange={(e) => setReturnForm({ ...returnForm, qty: e.target.value })} className="rounded-2xl" /></div><div><Label>Motivo</Label><Textarea value={returnForm.reason} onChange={(e) => setReturnForm({ ...returnForm, reason: e.target.value })} className="rounded-2xl" /></div></div><DialogFooter><Button className="rounded-2xl" onClick={addReturn}>Salvar devolução</Button></DialogFooter></DialogContent></Dialog>
    </div>
  );
}
