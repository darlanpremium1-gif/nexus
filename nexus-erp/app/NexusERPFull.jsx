"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  ShoppingCart, Users, Wallet, Plus, Trash2, MessageSquare, Download,
  Upload, Truck, Undo2, Search, Bell, Settings, BarChart3, ClipboardList,
  CreditCard, Boxes, Home, AlertTriangle, CheckCircle, TrendingUp,
  ShoppingBag, Send, Archive, Package, ArrowUp, ArrowDown, DollarSign,
  Receipt, UserCheck, RotateCcw, Eye, Shield, FileText, Database,
  ChevronDown, X, MoreHorizontal, Store, Pencil
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────
const STORAGE_KEY = "nexus-erp-full-v2";
const CATEGORIES = ["Lingerie", "Joias", "Acessórios", "Vestuário", "Eletrônicos", "Geral"];
const PAYMENT_METHODS = ["PIX", "Dinheiro", "Cartão Crédito", "Cartão Débito", "Fiado", "Transferência"];
const ROLES = ["Administrador", "Vendedor", "Financeiro", "Estoque"];

const seed = {
  products: [
    { id: "p1", sku: "AV-001", name: "Sutiã Renda Essencial", category: "Lingerie", cost: 39.9, price: 89.9, stock: 12, minStock: 4, supplierId: "s1" },
    { id: "p2", sku: "AV-002", name: "Calcinha Soft Premium", category: "Lingerie", cost: 19.9, price: 44.9, stock: 3, minStock: 6, supplierId: "s1" },
    { id: "p3", sku: "AV-003", name: "Colar Ponto de Luz", category: "Joias", cost: 120, price: 249.9, stock: 5, minStock: 2, supplierId: null },
    { id: "p4", sku: "AV-004", name: "Conjunto Rendado Nuit", category: "Lingerie", cost: 68, price: 149.9, stock: 0, minStock: 3, supplierId: "s1" },
    { id: "p5", sku: "AV-005", name: "Brinco Argola Dourada", category: "Joias", cost: 35, price: 79.9, stock: 8, minStock: 3, supplierId: null },
    { id: "p6", sku: "AV-006", name: "Body Transparente", category: "Lingerie", cost: 55, price: 119.9, stock: 2, minStock: 4, supplierId: "s1" },
  ],
  customers: [
    { id: "c1", name: "Consumidor Final", phone: "", city: "Manaus", creditLimit: 0, status: "Ativo" },
    { id: "c2", name: "Maria Oliveira", phone: "(92) 99999-0001", city: "Manaus", creditLimit: 300, status: "Ativo" },
    { id: "c3", name: "Fernanda Lima", phone: "(92) 98765-4321", city: "Manaus", creditLimit: 500, status: "Ativo" },
    { id: "c4", name: "Carla Santos", phone: "(92) 91234-5678", city: "Manaus", creditLimit: 200, status: "Inativo" },
  ],
  suppliers: [
    { id: "s1", name: "Fornecedor Premium Ltda", phone: "(11) 98888-0001", contact: "Ana Lima", category: "Lingerie" },
    { id: "s2", name: "Joias & Cia", phone: "(21) 97777-0002", contact: "Marcos", category: "Joias" },
  ],
  users: [
    { id: "u1", name: "Administrador", email: "admin@nexus.local", role: "Administrador", status: "Ativo" },
    { id: "u2", name: "Vendedora 01", email: "vendas1@nexus.local", role: "Vendedor", status: "Ativo" },
    { id: "u3", name: "Financeiro", email: "fin@nexus.local", role: "Financeiro", status: "Ativo" },
  ],
  permissions: [
    { role: "Administrador", modules: ["dashboard", "products", "customers", "suppliers", "pdv", "sales", "purchases", "returns", "finance", "reports", "chat", "users", "logs", "backup"] },
    { role: "Vendedor", modules: ["dashboard", "products", "customers", "pdv", "sales", "returns", "chat"] },
    { role: "Financeiro", modules: ["dashboard", "finance", "reports", "customers"] },
    { role: "Estoque", modules: ["dashboard", "products", "purchases"] },
  ],
  sales: [
    { id: "vd1", number: 1, date: "2026-03-28", customerId: "c2", paymentMethod: "PIX", items: [{ productId: "p1", name: "Sutiã Renda Essencial", price: 89.9, qty: 2 }], total: 179.8 },
    { id: "vd2", number: 2, date: "2026-03-29", customerId: "c3", paymentMethod: "Cartão Crédito", items: [{ productId: "p3", name: "Colar Ponto de Luz", price: 249.9, qty: 1 }], total: 249.9 },
    { id: "vd3", number: 3, date: "2026-03-30", customerId: "c1", paymentMethod: "Dinheiro", items: [{ productId: "p2", name: "Calcinha Soft Premium", price: 44.9, qty: 3 }], total: 134.7 },
  ],
  purchases: [
    { id: "co1", date: "2026-03-15", productId: "p1", supplierId: "s1", qty: 20, unitCost: 39.9, total: 798, note: "Reposição trimestral" },
    { id: "co2", date: "2026-03-20", productId: "p3", supplierId: "s2", qty: 5, unitCost: 120, total: 600, note: "" },
  ],
  returns: [
    { id: "dv1", saleId: "vd1", productId: "p1", qty: 1, reason: "Tamanho errado", total: 89.9, date: "2026-03-29" },
  ],
  receivables: [
    { id: "r1", description: "Venda #3 — Fiado", customerId: "c2", amount: 134.7, dueDate: "2026-04-05", status: "Aberto" },
    { id: "r2", description: "Acordo parcelas", customerId: "c3", amount: 249.9, dueDate: "2026-04-10", status: "Aberto" },
  ],
  payables: [
    { id: "pg1", description: "Compra Fornecedor Premium", supplier: "Fornecedor Premium Ltda", amount: 798, dueDate: "2026-04-01", status: "Aberto" },
    { id: "pg2", description: "Aluguel — Março/26", supplier: "Imobiliária Centro", amount: 3200, dueDate: "2026-03-22", status: "Aberto" },
    { id: "pg3", description: "Compra Joias & Cia", supplier: "Joias & Cia", amount: 600, dueDate: "2026-04-10", status: "Pago" },
  ],
  chatThreads: [
    {
      id: "th1", title: "Equipe Loja",
      messages: [
        { id: "m1", sender: "Administrador", text: "Bom dia, time! Metas de hoje: R$1.500 em vendas. Vamos!", at: "2026-03-31T08:00:00Z" },
        { id: "m2", sender: "Vendedora 01", text: "Bom dia! Já temos 2 clientes esperando.", at: "2026-03-31T08:05:00Z" },
      ]
    },
    {
      id: "th2", title: "Suporte Fornecedores",
      messages: [
        { id: "m3", sender: "Administrador", text: "Ana, quando chega o pedido AV-002?", at: "2026-03-30T14:00:00Z" },
      ]
    },
  ],
  logs: [
    { id: "l1", at: "2026-03-31T08:00:00Z", action: "Login", module: "Sistema", detail: "Administrador" },
    { id: "l2", at: "2026-03-30T16:00:00Z", action: "Finalizou venda", module: "PDV", detail: "Total R$134,70" },
    { id: "l3", at: "2026-03-29T10:00:00Z", action: "Registrou devolução", module: "Devoluções", detail: "Sutiã Renda Essencial" },
  ],
  backups: [],
};

// ─── Utils ────────────────────────────────────────────────────────────────────
function brl(v) { return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(v || 0)); }
function todayISO() { return new Date().toISOString().slice(0, 10); }
function dtNow() { return new Date().toISOString(); }
function fmtDate(iso) { if (!iso) return "—"; return new Date(iso).toLocaleDateString("pt-BR"); }
function fmtDatetime(iso) { if (!iso) return "—"; return new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }); }
function loadData() { try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : seed; } catch { return seed; } }
function saveData(d) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); } catch {} }

// ─── Small UI components ──────────────────────────────────────────────────────
function KPICard({ title, value, hint, icon: Icon, color = "blue", onClick }) {
  const colors = {
    blue: { bg: "bg-[#eef4ff]", text: "text-[#2453ff]" },
    green: { bg: "bg-[#ecfdf5]", text: "text-[#10b981]" },
    amber: { bg: "bg-[#fff7ed]", text: "text-[#f59e0b]" },
    red: { bg: "bg-[#fff1f2]", text: "text-[#ef4444]" },
    purple: { bg: "bg-[#f5f3ff]", text: "text-[#8b5cf6]" },
  };
  const c = colors[color] || colors.blue;
  return (
    <Card onClick={onClick} className={`rounded-[18px] border border-[#e4ebf5] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.03)] ${onClick ? "cursor-pointer hover:shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition-all" : ""}`}>
      <CardContent className="p-5 flex gap-4 items-start">
        <div className={`w-12 h-12 rounded-[14px] ${c.bg} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${c.text}`} />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#9AA8BA] font-semibold">{title}</p>
          <p className="text-2xl font-extrabold tracking-tight text-[#16243d] mt-1">{value}</p>
          {hint && <p className="text-xs text-[#9AA8BA] mt-1">{hint}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-[#16243d]">{title}</h2>
        {subtitle && <p className="text-sm text-[#9AA8BA] mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function EmptyState({ icon: Icon = Package, label = "Nenhum registro encontrado" }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-[#9AA8BA]">
      <Icon className="w-10 h-10" />
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}

function SearchBar({ value, onChange, placeholder = "Buscar...", className = "" }) {
  return (
    <div className={`flex items-center gap-2 bg-[#f5f7fb] border border-[#e4ebf5] rounded-xl px-3 h-10 ${className}`}>
      <Search className="w-4 h-4 text-[#9AA8BA] flex-shrink-0" />
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="bg-transparent outline-none text-sm w-full placeholder:text-[#C0CADC]" />
      {value && <button onClick={() => onChange("")}><X className="w-3.5 h-3.5 text-[#9AA8BA] hover:text-slate-600" /></button>}
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    Ativo: "bg-[#ecfdf5] text-[#10b981] border-[#d1fae5]",
    Inativo: "bg-[#f9fafb] text-[#9AA8BA] border-[#e4ebf5]",
    Aberto: "bg-[#fff7ed] text-[#f59e0b] border-[#fed7aa]",
    Pago: "bg-[#ecfdf5] text-[#10b981] border-[#d1fae5]",
    Vencido: "bg-[#fff1f2] text-[#ef4444] border-[#fecdd3]",
  };
  return <Badge className={`${map[status] || map.Ativo} border rounded-lg text-[11px] font-semibold shadow-none hover:bg-inherit`}>{status}</Badge>;
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function NexusERPFull() {
  // Navigation
  const navItems = [
    { key: "dashboard", label: "Dashboard", icon: Home },
    { key: "pdv", label: "PDV", icon: Store },
    { key: "products", label: "Estoque", icon: Boxes },
    { key: "sales", label: "Vendas", icon: ShoppingCart },
    { key: "purchases", label: "Compras", icon: Truck },
    { key: "returns", label: "Devoluções", icon: Undo2 },
    { key: "customers", label: "Clientes", icon: Users },
    { key: "finance", label: "Financeiro", icon: CreditCard },
    { key: "reports", label: "Relatórios", icon: BarChart3 },
    { key: "chat", label: "Mensagens", icon: MessageSquare },
    { key: "admin", label: "Admin", icon: Settings },
  ];

  // Core state
  const [db, setDb] = useState(seed);
  const [tab, setTab] = useState("dashboard");

  // Per-module search/filter
  const [productSearch, setProductSearch] = useState("");
  const [productCat, setProductCat] = useState("todos");
  const [saleSearch, setSaleSearch] = useState("");
  const [purchaseSearch, setPurchaseSearch] = useState("");
  const [returnSearch, setReturnSearch] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");
  const [financeMode, setFinanceMode] = useState("receber");
  const [financeSearch, setFinanceSearch] = useState("");
  const [reportView, setReportView] = useState("geral");
  const [adminView, setAdminView] = useState("usuarios");
  const [pdvSearch, setPdvSearch] = useState("");

  // Modals: null | 'product'|'customer'|'supplier'|'user'|'payable'|'receivable'|'purchase'|'return'|'saleDetail'|'stockEntry'
  const [modal, setModal] = useState(null);
  const [modalData, setModalData] = useState(null); // for pre-filling

  // Forms
  const emptyProduct = { sku: "", name: "", category: "Lingerie", cost: "", price: "", stock: "", minStock: "", supplierId: "" };
  const emptyCustomer = { name: "", phone: "", city: "Manaus", creditLimit: "", status: "Ativo" };
  const emptySupplier = { name: "", phone: "", contact: "", category: "Lingerie" };
  const emptyUser = { name: "", email: "", role: "Vendedor", status: "Ativo" };
  const emptyPayable = { description: "", supplier: "", amount: "", dueDate: todayISO() };
  const emptyReceivable = { description: "", customerId: "", amount: "", dueDate: todayISO() };
  const emptyPurchase = { supplierId: "", productId: "", qty: "", unitCost: "", note: "" };
  const emptyReturn = { saleId: "", productId: "", qty: "", reason: "" };

  const [productForm, setProductForm] = useState(emptyProduct);
  const [customerForm, setCustomerForm] = useState(emptyCustomer);
  const [supplierForm, setSupplierForm] = useState(emptySupplier);
  const [userForm, setUserForm] = useState(emptyUser);
  const [payableForm, setPayableForm] = useState(emptyPayable);
  const [receivableForm, setReceivableForm] = useState(emptyReceivable);
  const [purchaseForm, setPurchaseForm] = useState(emptyPurchase);
  const [returnForm, setReturnForm] = useState(emptyReturn);

  // Cart
  const [cart, setCart] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("PIX");

  // Chat
  const [selectedThreadId, setSelectedThreadId] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const chatEndRef = useRef(null);

  // ── Effects ──────────────────────────────────────────────────────────────
  useEffect(() => { setDb(loadData()); }, []);
  useEffect(() => { saveData(db); }, [db]);
  useEffect(() => { if (!selectedThreadId && db.chatThreads[0]) setSelectedThreadId(db.chatThreads[0].id); }, [db.chatThreads, selectedThreadId]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [db.chatThreads, selectedThreadId]);
  useEffect(() => {
    if (modalData) {
      if (modal === "product") setProductForm({ ...emptyProduct, ...modalData, stock: String(modalData.stock), minStock: String(modalData.minStock), cost: String(modalData.cost), price: String(modalData.price) });
      else if (modal === "customer") setCustomerForm({ ...emptyCustomer, ...modalData, creditLimit: String(modalData.creditLimit) });
      else if (modal === "supplier") setSupplierForm({ ...emptySupplier, ...modalData });
      else if (modal === "user") setUserForm({ ...emptyUser, ...modalData });
      else if (modal === "payable") setPayableForm({ ...emptyPayable, ...modalData, amount: String(modalData.amount) });
      else if (modal === "receivable") setReceivableForm({ ...emptyReceivable, ...modalData, amount: String(modalData.amount) });
    } else {
      setProductForm(emptyProduct); setCustomerForm(emptyCustomer); setSupplierForm(emptySupplier); setUserForm(emptyUser); setPayableForm(emptyPayable); setReceivableForm(emptyReceivable); setPurchaseForm(emptyPurchase); setReturnForm(emptyReturn);
    }
  }, [modal, modalData]);

  // ── Core helpers ─────────────────────────────────────────────────────────
  function updateDb(updater, logInfo) {
    setDb(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      if (!logInfo) return next;
      return { ...next, logs: [{ id: crypto.randomUUID(), at: dtNow(), action: logInfo.action, module: logInfo.module, detail: logInfo.detail }, ...(next.logs || [])] };
    });
  }
  function customerName(id) { return db.customers.find(c => c.id === id)?.name || "Consumidor Final"; }
  function supplierName(id) { return db.suppliers.find(s => s.id === id)?.name || "—"; }
  function productName(id) { return db.products.find(p => p.id === id)?.name || "—"; }
  function openModal(type, data = null) { setModalData(data); setModal(type); }
  function closeModal() { setModal(null); setModalData(null); }

  // ── CRUD Handlers ─────────────────────────────────────────────────────────
  function addProduct() {
    if (!productForm.name || !productForm.sku) return;
    const item = { id: modalData?.id || crypto.randomUUID(), sku: productForm.sku.trim(), name: productForm.name.trim(), category: productForm.category, cost: Number(productForm.cost || 0), price: Number(productForm.price || 0), stock: Number(productForm.stock || 0), minStock: Number(productForm.minStock || 0), supplierId: productForm.supplierId || null };
    updateDb(prev => ({ ...prev, products: modalData?.id ? prev.products.map(i => i.id === item.id ? item : i) : [item, ...prev.products] }), { action: modalData?.id ? "Atualizou produto" : "Criou produto", module: "Estoque", detail: item.name });
    setProductForm(emptyProduct); closeModal();
  }
  function addCustomer() {
    if (!customerForm.name) return;
    const item = { id: modalData?.id || crypto.randomUUID(), name: customerForm.name.trim(), phone: customerForm.phone.trim(), city: customerForm.city.trim(), creditLimit: Number(customerForm.creditLimit || 0), status: customerForm.status };
    updateDb(prev => ({ ...prev, customers: modalData?.id ? prev.customers.map(i => i.id === item.id ? item : i) : [item, ...prev.customers] }), { action: modalData?.id ? "Atualizou cliente" : "Criou cliente", module: "Clientes", detail: item.name });
    setCustomerForm(emptyCustomer); closeModal();
  }
  function addSupplier() {
    if (!supplierForm.name) return;
    const item = { id: modalData?.id || crypto.randomUUID(), ...supplierForm };
    updateDb(prev => ({ ...prev, suppliers: modalData?.id ? prev.suppliers.map(i => i.id === item.id ? item : i) : [item, ...prev.suppliers] }), { action: modalData?.id ? "Atualizou fornecedor" : "Criou fornecedor", module: "Compras", detail: item.name });
    setSupplierForm(emptySupplier); closeModal();
  }
  function addUser() {
    if (!userForm.name || !userForm.email) return;
    const item = { id: modalData?.id || crypto.randomUUID(), ...userForm };
    updateDb(prev => ({ ...prev, users: modalData?.id ? prev.users.map(i => i.id === item.id ? item : i) : [item, ...prev.users] }), { action: modalData?.id ? "Atualizou usuário" : "Criou usuário", module: "Admin", detail: item.name });
    setUserForm(emptyUser); closeModal();
  }
  function addPayable() {
    if (!payableForm.description || !payableForm.amount) return;
    const item = { id: modalData?.id || crypto.randomUUID(), description: payableForm.description, supplier: payableForm.supplier, amount: Number(payableForm.amount), dueDate: payableForm.dueDate, status: modalData?.status || "Aberto" };
    updateDb(prev => ({ ...prev, payables: modalData?.id ? prev.payables.map(i => i.id === item.id ? item : i) : [item, ...prev.payables] }), { action: modalData?.id ? "Atualizou conta a pagar" : "Criou conta a pagar", module: "Financeiro", detail: item.description });
    setPayableForm(emptyPayable); closeModal();
  }
  function addReceivable() {
    if (!receivableForm.description || !receivableForm.amount) return;
    const item = { id: modalData?.id || crypto.randomUUID(), description: receivableForm.description, customerId: receivableForm.customerId || null, amount: Number(receivableForm.amount), dueDate: receivableForm.dueDate, status: modalData?.status || "Aberto" };
    updateDb(prev => ({ ...prev, receivables: modalData?.id ? prev.receivables.map(i => i.id === item.id ? item : i) : [item, ...prev.receivables] }), { action: modalData?.id ? "Atualizou conta a receber" : "Criou conta a receber", module: "Financeiro", detail: item.description });
    setReceivableForm(emptyReceivable); closeModal();
  }
  function addPurchase() {
    if (!purchaseForm.productId || !purchaseForm.qty || !purchaseForm.unitCost) return;
    const product = db.products.find(p => p.id === purchaseForm.productId);
    const supplier = db.suppliers.find(s => s.id === purchaseForm.supplierId);
    const qty = Number(purchaseForm.qty);
    const unitCost = Number(purchaseForm.unitCost);
    const purchase = { id: crypto.randomUUID(), date: todayISO(), productId: purchaseForm.productId, supplierId: purchaseForm.supplierId || null, qty, unitCost, total: qty * unitCost, note: purchaseForm.note };
    updateDb(prev => ({
      ...prev,
      purchases: [purchase, ...prev.purchases],
      products: prev.products.map(p => p.id === purchase.productId ? { ...p, stock: p.stock + qty, cost: unitCost, supplierId: purchase.supplierId || p.supplierId } : p),
      payables: supplier ? [{ id: crypto.randomUUID(), description: `Compra — ${product?.name || "Produto"}`, supplier: supplier.name, amount: qty * unitCost, dueDate: todayISO(), status: "Aberto" }, ...prev.payables] : prev.payables,
    }), { action: "Registrou compra", module: "Compras", detail: product?.name || "Produto" });
    setPurchaseForm(emptyPurchase); closeModal();
  }
  function addReturn() {
    if (!returnForm.saleId || !returnForm.productId || !returnForm.qty) return;
    const sale = db.sales.find(s => s.id === returnForm.saleId);
    const product = db.products.find(p => p.id === returnForm.productId);
    const soldItem = sale?.items.find(i => i.productId === returnForm.productId);
    const qty = Number(returnForm.qty);
    const unit = soldItem?.price || product?.price || 0;
    const item = { id: crypto.randomUUID(), saleId: returnForm.saleId, productId: returnForm.productId, qty, reason: returnForm.reason, total: qty * unit, date: todayISO() };
    updateDb(prev => ({
      ...prev,
      returns: [item, ...prev.returns],
      products: prev.products.map(p => p.id === item.productId ? { ...p, stock: p.stock + qty } : p),
    }), { action: "Registrou devolução", module: "Devoluções", detail: product?.name || "Produto" });
    setReturnForm(emptyReturn); closeModal();
  }
  function removeItem(type, id) {
    if (type === "products") {
      if (db.sales.some(s => s.items.some(i => i.productId === id))) return alert("Atenção: Não é possível excluir, pois o produto já existe em vendas concluídas.");
      if (db.purchases.some(p => p.productId === id)) return alert("Atenção: Não é possível excluir, pois o produto possui histórico nas Compras.");
    }
    if (type === "customers" && db.sales.some(s => s.customerId === id)) return alert("Atenção: Não é possível excluir este cliente, pois existem vendas atreladas a ele.");
    if (type === "suppliers" && (db.products.some(p => p.supplierId === id) || db.purchases.some(p => p.supplierId === id))) return alert("Atenção: Não é possível excluir. O fornecedor já foi utilizado em produtos ou compras.");

    updateDb(prev => ({ ...prev, [type]: prev[type].filter(i => i.id !== id) }), { action: "Removeu registro", module: type, detail: id });
  }
  function markPaid(type, id) {
    updateDb(prev => ({ ...prev, [type]: prev[type].map(i => i.id === id ? { ...i, status: "Pago" } : i) }), { action: "Baixou título", module: "Financeiro", detail: id });
  }

  // ── Cart & PDV ──────────────────────────────────────────────────────────
  function addToCart(product) {
    if (product.stock <= 0) return;
    setCart(prev => {
      const found = prev.find(i => i.productId === product.id);
      if (found) return prev.map(i => i.productId === product.id ? { ...i, qty: Math.min(i.qty + 1, product.stock) } : i);
      return [...prev, { productId: product.id, name: product.name, price: product.price, qty: 1 }];
    });
  }
  function updateCartQty(productId, delta) {
    setCart(prev => prev.map(i => i.productId === productId ? { ...i, qty: i.qty + delta } : i).filter(i => i.qty > 0));
  }
  const cartTotal = useMemo(() => cart.reduce((s, i) => s + i.price * i.qty, 0), [cart]);
  function finalizeSale() {
    if (!cart.length) return;
    updateDb(prev => {
      const sale = { id: crypto.randomUUID(), number: prev.sales.length + 1, date: todayISO(), customerId: customerId || null, paymentMethod, items: cart, total: cartTotal };
      return {
        ...prev,
        sales: [sale, ...prev.sales],
        products: prev.products.map(p => { const ci = cart.find(c => c.productId === p.id); return ci ? { ...p, stock: Math.max(0, p.stock - ci.qty) } : p; }),
        receivables: paymentMethod === "Fiado" ? [{ id: crypto.randomUUID(), description: `Venda #${sale.number}`, customerId: customerId || null, amount: cartTotal, dueDate: todayISO(), status: "Aberto" }, ...prev.receivables] : prev.receivables,
      };
    }, { action: "Finalizou venda", module: "PDV", detail: `Total ${brl(cartTotal)}` });
    setCart([]); setCustomerId(""); setPaymentMethod("PIX"); setTab("sales");
  }

  // ── Chat ─────────────────────────────────────────────────────────────────
  function sendChatMessage() {
    if (!chatMessage.trim() || !selectedThreadId) return;
    updateDb(prev => ({
      ...prev,
      chatThreads: prev.chatThreads.map(t => t.id === selectedThreadId ? { ...t, messages: [...t.messages, { id: crypto.randomUUID(), sender: "Administrador", text: chatMessage.trim(), at: dtNow() }] } : t),
    }));
    setChatMessage("");
  }

  // ── Backup ───────────────────────────────────────────────────────────────
  function createBackup() {
    const snapshot = JSON.stringify(db, null, 2);
    const stamp = dtNow();
    const backup = { id: crypto.randomUUID(), at: stamp, size: snapshot.length, label: `backup-${stamp}` };
    updateDb(prev => ({ ...prev, backups: [backup, ...prev.backups] }), { action: "Criou backup", module: "Backup", detail: backup.label });
    const blob = new Blob([snapshot], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${backup.label}.json`; a.click(); URL.revokeObjectURL(url);
  }
  const fileInputRef = useRef(null);
  function importBackup(e) {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { try { const p = JSON.parse(String(reader.result)); setDb({ ...p, logs: [{ id: crypto.randomUUID(), at: dtNow(), action: "Importou backup", module: "Backup", detail: file.name }, ...(p.logs || [])] }); } catch {} };
    reader.readAsText(file);
    e.target.value = "";
  }

  // ── Derived / Metrics ─────────────────────────────────────────────────────
  const metrics = useMemo(() => {
    const today = todayISO();
    const salesToday = db.sales.filter(s => s.date === today);
    const revenueToday = salesToday.reduce((s, sale) => s + sale.total, 0);
    const revenueMonth = db.sales.reduce((s, sale) => s + sale.total, 0);
    const lowStock = db.products.filter(p => p.stock <= p.minStock).length;
    const outOfStock = db.products.filter(p => p.stock === 0).length;
    const openReceivables = db.receivables.filter(r => r.status === "Aberto").reduce((s, r) => s + r.amount, 0);
    const openPayables = db.payables.filter(p => p.status === "Aberto").reduce((s, p) => s + p.amount, 0);
    const totalPurchases = db.purchases.reduce((s, p) => s + p.total, 0);
    const totalReturns = db.returns.reduce((s, r) => s + r.total, 0);
    const inventoryValue = db.products.reduce((s, p) => s + p.cost * p.stock, 0);
    return { revenueToday, revenueMonth, lowStock, outOfStock, openReceivables, openPayables, totalPurchases, totalReturns, inventoryValue };
  }, [db]);

  // ── Filtered lists ────────────────────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    const t = productSearch.toLowerCase();
    return db.products.filter(p =>
      (productCat === "todos" || p.category === productCat) &&
      (!t || p.name.toLowerCase().includes(t) || p.sku.toLowerCase().includes(t) || p.category.toLowerCase().includes(t))
    );
  }, [db.products, productSearch, productCat]);

  const filteredPdvProducts = useMemo(() => {
    const t = pdvSearch.toLowerCase();
    return db.products.filter(p => !t || p.name.toLowerCase().includes(t) || p.sku.toLowerCase().includes(t));
  }, [db.products, pdvSearch]);

  const filteredSales = useMemo(() => {
    const t = saleSearch.toLowerCase();
    return db.sales.filter(s =>
      !t || String(s.number).includes(t) || customerName(s.customerId).toLowerCase().includes(t) || s.paymentMethod.toLowerCase().includes(t) || brl(s.total).includes(t)
    );
  }, [db.sales, saleSearch, db.customers]);

  const filteredPurchases = useMemo(() => {
    const t = purchaseSearch.toLowerCase();
    return db.purchases.filter(p =>
      !t || productName(p.productId).toLowerCase().includes(t) || supplierName(p.supplierId).toLowerCase().includes(t) || (p.note || "").toLowerCase().includes(t)
    );
  }, [db.purchases, purchaseSearch, db.products, db.suppliers]);

  const filteredReturns = useMemo(() => {
    const t = returnSearch.toLowerCase();
    return db.returns.filter(r =>
      !t || productName(r.productId).toLowerCase().includes(t) || (r.reason || "").toLowerCase().includes(t) || String(r.saleId).includes(t)
    );
  }, [db.returns, returnSearch, db.products]);

  const filteredCustomers = useMemo(() => {
    const t = customerSearch.toLowerCase();
    return db.customers.filter(c =>
      !t || c.name.toLowerCase().includes(t) || (c.phone || "").includes(t) || (c.city || "").toLowerCase().includes(t)
    );
  }, [db.customers, customerSearch]);

  const filteredFinance = useMemo(() => {
    const list = financeMode === "receber" ? db.receivables : db.payables;
    const t = financeSearch.toLowerCase();
    return list.filter(i =>
      !t || (i.description || "").toLowerCase().includes(t) || (i.supplier || customerName(i.customerId) || "").toLowerCase().includes(t) || brl(i.amount).includes(t)
    );
  }, [db.receivables, db.payables, financeMode, financeSearch, db.customers]);

  const activeThread = db.chatThreads.find(t => t.id === selectedThreadId);

  // ── Quick stock entry helper ──────────────────────────────────────────────
  function quickStockEntry(product) {
    setPurchaseForm({ ...emptyPurchase, productId: product.id, unitCost: String(product.cost) });
    openModal("purchase");
  }
  function quickSell(product) {
    addToCart(product);
    setTab("pdv");
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#eef3f9] flex">

      {/* ── Icon Sidebar ─────────────────────────────────────────────────── */}
      <aside className="w-[72px] bg-white border-r border-[#e4ebf5] flex flex-col items-center py-4 gap-2 shadow-sm flex-shrink-0 z-10">
        <div className="w-11 h-11 rounded-2xl bg-[#2453ff] text-white flex items-center justify-center font-extrabold text-lg shadow-md mb-2">#</div>
        <div className="flex flex-col gap-1 w-full px-2 flex-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = tab === item.key;
            return (
              <button key={item.key} onClick={() => setTab(item.key)} title={item.label}
                className={`w-full h-10 rounded-xl flex items-center justify-center transition-all ${active ? "bg-[#eff4ff] text-[#2453ff] shadow-[inset_0_0_0_1px_#c7d9ff]" : "text-[#9AA8BA] hover:bg-[#f5f7fb] hover:text-slate-600"}`}>
                <Icon className="w-4.5 h-4.5" />
              </button>
            );
          })}
        </div>
        <div className="w-full px-2 pb-1">
          <div className="rounded-xl bg-[#f5f7fb] border border-[#e4ebf5] p-2 text-center">
            <p className="text-[9px] uppercase tracking-wide text-[#9AA8BA] font-bold">Caixa</p>
            <p className="text-sm font-extrabold text-[#10b981] mt-0.5">{brl(metrics.revenueToday)}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#eff4ff] text-[#2453ff] flex items-center justify-center text-xs font-bold mt-2 mx-auto">AD</div>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-[#e4ebf5] px-6 py-3 flex items-center gap-3 flex-shrink-0">
          <SearchBar value="" onChange={() => {}} placeholder="Buscar no sistema..." className="max-w-sm" />
          <div className="ml-auto flex items-center gap-3">
            {metrics.lowStock > 0 && (
              <button onClick={() => setTab("products")} className="rounded-xl border border-amber-200 bg-amber-50 text-amber-600 px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />{metrics.lowStock} alerta(s)
              </button>
            )}
            <button className="relative text-[#9AA8BA] hover:text-slate-600">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center">1</span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#eff4ff] text-[#2453ff] font-bold flex items-center justify-center text-xs">AD</div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-slate-700 leading-none">Administrador</p>
                <p className="text-xs text-[#9AA8BA] mt-0.5">Gerente</p>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-5">
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>

              {/* ════════════════════════ DASHBOARD ═══════════════════════ */}
              {tab === "dashboard" && (
                <div className="space-y-5">
                  <div className="flex items-end justify-between">
                    <div>
                      <h1 className="text-3xl font-extrabold tracking-tight text-[#16243d]">Olá, Administrador 👋</h1>
                      <p className="text-sm text-[#9AA8BA] mt-1">{new Date().toLocaleDateString("pt-BR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setTab("reports")} className="rounded-xl h-9 border-[#e4ebf5] text-slate-500 text-sm">
                        <Download className="w-4 h-4 mr-1.5" />Relatório
                      </Button>
                      <Button onClick={() => setTab("pdv")} className="rounded-xl h-9 bg-[#2453ff] hover:bg-[#1f46d6] text-white text-sm">
                        <Store className="w-4 h-4 mr-1.5" />Abrir PDV
                      </Button>
                    </div>
                  </div>

                  {/* KPIs */}
                  <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                    {[
                      { title: "Faturamento do mês", value: brl(metrics.revenueMonth), icon: Wallet, color: "blue", onClick: () => setTab("reports") },
                      { title: "Vendas realizadas", value: String(db.sales.length), icon: ClipboardList, color: "green", onClick: () => setTab("sales") },
                      { title: "A receber", value: brl(metrics.openReceivables), icon: ArrowDown, color: "green", onClick: () => { setFinanceMode("receber"); setTab("finance"); } },
                      { title: "A pagar", value: brl(metrics.openPayables), icon: ArrowUp, color: "red", onClick: () => { setFinanceMode("pagar"); setTab("finance"); } },
                      { title: "Estoque crítico", value: `${metrics.lowStock} SKUs`, icon: AlertTriangle, color: "amber", onClick: () => setTab("products") },
                      { title: "Devoluções", value: String(db.returns.length), icon: Undo2, color: "purple", onClick: () => setTab("returns") },
                    ].map(kpi => <KPICard key={kpi.title} {...kpi} />)}
                  </div>

                  {/* Chart + Payment donut */}
                  <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-4">
                    <Card className="rounded-[20px] border border-[#e4ebf5] bg-white">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-base font-bold text-[#1B2A41]">Faturamento — Últimos 12 meses</CardTitle>
                            <p className="text-xs text-[#9AA8BA] mt-0.5">Vendas vs Devoluções</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {(() => {
                          const chartBars = ["abr/25","mai/25","jun/25","jul/25","ago/25","set/25","out/25","nov/25","dez/25","jan/26","fev/26","mar/26"].map((m, i) => ({
                            m, sales: [0,0,0,0,0,0,0,0,303.5,6301.9,9732.3,metrics.revenueMonth][i], returns: [0,0,0,0,0,0,0,0,0,1899,0,metrics.totalReturns][i]
                          }));
                          const maxBar = Math.max(...chartBars.map(i => Math.max(i.sales, i.returns)), 1);
                          return (
                            <div className="h-56 flex items-end justify-between gap-2 px-2 pt-2">
                              {chartBars.map(item => {
                                const sh = Math.max((item.sales / maxBar) * 100, item.sales > 0 ? 6 : 2);
                                const rh = Math.max((item.returns / maxBar) * 100, item.returns > 0 ? 4 : 0);
                                return (
                                  <div key={item.m} className="flex-1 flex flex-col items-center justify-end gap-1 h-full group cursor-pointer" onClick={() => setTab("sales")}>
                                    <div className="w-full flex items-end justify-center gap-0.5 flex-1">
                                      {rh > 0 && <div className="w-[8px] rounded-t-sm bg-[#ef4444] opacity-70" style={{ height: `${rh}%` }} />}
                                      <div className="w-[14px] rounded-t-[3px] bg-[#2453ff] group-hover:bg-[#1f46d6] transition-colors" style={{ height: `${sh}%` }} />
                                    </div>
                                    <span className="text-[9px] text-[#9AA8BA] whitespace-nowrap">{item.m}</span>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })()}
                      </CardContent>
                    </Card>

                    <Card className="rounded-[20px] border border-[#e4ebf5] bg-white">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base font-bold text-[#1B2A41]">Últimas Vendas</CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        {db.sales.length === 0 ? (
                          <EmptyState icon={ShoppingCart} label="Nenhuma venda ainda" />
                        ) : (
                          <div className="divide-y divide-[#f0f4f9]">
                            {db.sales.slice(0, 5).map(sale => (
                              <button key={sale.id} onClick={() => setTab("sales")} className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#f9fbff] text-left transition-colors">
                                <div>
                                  <p className="text-sm font-semibold text-[#22324A]">Venda #{sale.number}</p>
                                  <p className="text-xs text-[#9AA8BA]">{customerName(sale.customerId)} · {fmtDate(sale.date)}</p>
                                </div>
                                <span className="text-sm font-bold text-[#2453ff]">{brl(sale.total)}</span>
                              </button>
                            ))}
                          </div>
                        )}
                        <div className="px-4 pb-3 pt-1">
                          <Button variant="outline" onClick={() => setTab("sales")} size="sm" className="w-full rounded-lg text-xs border-[#e4ebf5] text-slate-500">Ver todas as vendas</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Low stock + payables alerts */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    <Card className="rounded-[20px] border border-[#e4ebf5] bg-white">
                      <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <CardTitle className="text-base font-bold text-[#1B2A41]">⚠️ Estoque Crítico</CardTitle>
                        <Button variant="outline" onClick={() => setTab("products")} size="sm" className="rounded-lg text-xs border-[#e4ebf5] text-slate-500">Ver tudo</Button>
                      </CardHeader>
                      <CardContent className="pt-0">
                        {db.products.filter(p => p.stock <= p.minStock).length === 0 ? (
                          <p className="text-sm text-[#9AA8BA] text-center py-4">Estoque em dia ✓</p>
                        ) : (
                          <div className="space-y-2">
                            {db.products.filter(p => p.stock <= p.minStock).slice(0, 5).map(p => (
                              <button key={p.id} onClick={() => { setTab("products"); }} className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[#f5f7fb] text-left">
                                <div>
                                  <p className="text-sm font-semibold text-[#22324A]">{p.name}</p>
                                  <p className="text-xs text-[#9AA8BA]">{p.category} · Mín: {p.minStock}</p>
                                </div>
                                <Badge className={`${p.stock === 0 ? "bg-[#fff1f2] text-[#ef4444] border-[#fecdd3]" : "bg-[#fff7ed] text-[#f59e0b] border-[#fed7aa]"} border rounded-lg text-xs font-bold shadow-none`}>
                                  {p.stock === 0 ? "Esgotado" : `${p.stock} un`}
                                </Badge>
                              </button>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card className="rounded-[20px] border border-[#e4ebf5] bg-white">
                      <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <CardTitle className="text-base font-bold text-[#1B2A41]">💸 Contas Vencendo</CardTitle>
                        <Button variant="outline" onClick={() => { setFinanceMode("pagar"); setTab("finance"); }} size="sm" className="rounded-lg text-xs border-[#e4ebf5] text-slate-500">Ver financeiro</Button>
                      </CardHeader>
                      <CardContent className="pt-0">
                        {db.payables.filter(p => p.status === "Aberto").length === 0 ? (
                          <p className="text-sm text-[#9AA8BA] text-center py-4">Nada em aberto ✓</p>
                        ) : (
                          <div className="space-y-2">
                            {db.payables.filter(p => p.status === "Aberto").slice(0, 5).map(p => (
                              <button key={p.id} onClick={() => { setFinanceMode("pagar"); setTab("finance"); }} className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[#f5f7fb] text-left">
                                <div>
                                  <p className="text-sm font-semibold text-[#22324A]">{p.description}</p>
                                  <p className="text-xs text-[#9AA8BA]">{p.supplier} · vence {fmtDate(p.dueDate)}</p>
                                </div>
                                <span className="text-sm font-bold text-[#ef4444]">{brl(p.amount)}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* ════════════════════════ PDV ═════════════════════════════ */}
              {tab === "pdv" && (
                <div className="space-y-4">
                  <SectionHeader title="Ponto de Venda" subtitle="Registre vendas rapidamente" />
                  <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-5">
                    {/* Product grid */}
                    <div className="space-y-4">
                      <SearchBar value={pdvSearch} onChange={setPdvSearch} placeholder="Buscar produto por nome ou SKU..." />
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {filteredPdvProducts.map(product => {
                          const inCart = cart.find(i => i.productId === product.id);
                          return (
                            <button key={product.id} onClick={() => addToCart(product)} disabled={product.stock <= 0}
                              className={`p-4 rounded-[16px] border text-left transition-all ${product.stock <= 0 ? "opacity-40 cursor-not-allowed bg-white border-[#e4ebf5]" : "bg-white border-[#e4ebf5] hover:border-[#2453ff] hover:shadow-[0_0_0_2px_#d6e4ff]"} ${inCart ? "border-[#2453ff] shadow-[0_0_0_2px_#d6e4ff]" : ""}`}>
                              <div className="w-10 h-10 rounded-xl bg-[#eef4ff] flex items-center justify-center mb-2">
                                <ShoppingBag className="w-5 h-5 text-[#2453ff]" />
                              </div>
                              <p className="text-xs text-[#9AA8BA] font-mono">{product.sku}</p>
                              <p className="text-sm font-semibold text-[#1B2A41] mt-0.5 leading-tight">{product.name}</p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-base font-extrabold text-[#2453ff]">{brl(product.price)}</span>
                                <span className={`text-xs font-semibold ${product.stock <= product.minStock ? "text-amber-500" : "text-[#10b981]"}`}>{product.stock} un</span>
                              </div>
                              {inCart && <div className="mt-2 text-xs font-semibold text-[#2453ff] bg-[#eef4ff] rounded-lg px-2 py-0.5 text-center">{inCart.qty} no carrinho</div>}
                            </button>
                          );
                        })}
                        {filteredPdvProducts.length === 0 && <div className="col-span-3"><EmptyState icon={Package} label="Nenhum produto encontrado" /></div>}
                      </div>
                    </div>

                    {/* Cart */}
                    <div className="bg-white rounded-[20px] border border-[#e4ebf5] p-5 flex flex-col gap-4 h-fit sticky top-0">
                      <h3 className="text-base font-bold text-[#1B2A41]">Carrinho</h3>
                      {cart.length === 0 ? (
                        <div className="py-8 text-center text-[#9AA8BA]">
                          <ShoppingCart className="w-8 h-8 mx-auto mb-2" />
                          <p className="text-sm">Carrinho vazio</p>
                        </div>
                      ) : (
                        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                          {cart.map(item => (
                            <div key={item.productId} className="flex items-center gap-3 p-2 rounded-xl bg-[#f9fbff] border border-[#eef4ff]">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-[#22324A] truncate">{item.name}</p>
                                <p className="text-xs text-[#9AA8BA]">{brl(item.price)} × {item.qty} = {brl(item.price * item.qty)}</p>
                              </div>
                              <div className="flex items-center gap-1">
                                <button onClick={() => updateCartQty(item.productId, -1)} className="w-6 h-6 rounded-lg bg-white border border-[#e4ebf5] flex items-center justify-center text-slate-500 hover:border-red-200 hover:text-red-500 text-sm font-bold">−</button>
                                <span className="w-6 text-center text-sm font-bold">{item.qty}</span>
                                <button onClick={() => updateCartQty(item.productId, 1)} className="w-6 h-6 rounded-lg bg-white border border-[#e4ebf5] flex items-center justify-center text-slate-500 hover:border-[#2453ff] hover:text-[#2453ff] text-sm font-bold">+</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="space-y-3 border-t border-[#e4ebf5] pt-3">
                        <div>
                          <Label className="text-xs text-[#9AA8BA]">Cliente</Label>
                          <Select value={customerId} onValueChange={setCustomerId}>
                            <SelectTrigger className="mt-1 rounded-xl border-[#e4ebf5] text-sm h-9">
                              <SelectValue placeholder="Consumidor Final" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">Consumidor Final</SelectItem>
                              {db.customers.filter(c => c.status === "Ativo" && c.id !== "c1").map(c => (
                                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs text-[#9AA8BA]">Forma de pagamento</Label>
                          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                            <SelectTrigger className="mt-1 rounded-xl border-[#e4ebf5] text-sm h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {PAYMENT_METHODS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="border-t border-[#e4ebf5] pt-3">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm text-[#9AA8BA]">Total</span>
                          <span className="text-2xl font-extrabold text-[#1B2A41]">{brl(cartTotal)}</span>
                        </div>
                        <Button onClick={finalizeSale} disabled={!cart.length} className="w-full rounded-xl h-11 bg-[#2453ff] hover:bg-[#1f46d6] text-white font-bold disabled:opacity-40">
                          <CheckCircle className="w-4 h-4 mr-2" />Finalizar Venda
                        </Button>
                        {cart.length > 0 && (
                          <button onClick={() => setCart([])} className="w-full mt-2 text-xs text-[#9AA8BA] hover:text-red-500 transition-colors">Limpar carrinho</button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ════════════════════════ PRODUTOS ════════════════════════ */}
              {tab === "products" && (
                <div className="space-y-4">
                  <SectionHeader title="Estoque" subtitle="Gerencie produtos e inventário"
                    action={<Button onClick={() => openModal("product")} className="rounded-xl h-9 bg-[#2453ff] hover:bg-[#1f46d6] text-white text-sm"><Plus className="w-4 h-4 mr-1.5" />Novo Produto</Button>} />

                  {/* KPIs */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <KPICard title="Total SKUs" value={String(db.products.length)} icon={Boxes} color="blue" />
                    <KPICard title="Valor em estoque" value={brl(metrics.inventoryValue)} icon={DollarSign} color="green" />
                    <KPICard title="Estoque crítico" value={`${metrics.lowStock}`} hint="abaixo do mínimo" icon={AlertTriangle} color="amber" />
                    <KPICard title="Sem estoque" value={`${metrics.outOfStock}`} icon={Package} color="red" />
                  </div>

                  {/* Filters */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <SearchBar value={productSearch} onChange={setProductSearch} placeholder="Buscar por nome ou SKU..." className="flex-1" />
                    <Select value={productCat} onValueChange={setProductCat}>
                      <SelectTrigger className="w-full sm:w-48 rounded-xl border-[#e4ebf5] text-sm h-10">
                        <SelectValue placeholder="Categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todas as categorias</SelectItem>
                        {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={() => openModal("purchase")} className="rounded-xl h-10 border-[#e4ebf5] text-slate-600 text-sm whitespace-nowrap">
                      <ArrowUp className="w-4 h-4 mr-1.5 text-[#10b981]" />Entrada de Estoque
                    </Button>
                  </div>

                  {/* Table */}
                  <Card className="rounded-[20px] border border-[#e4ebf5] bg-white overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-[#f0f4f9] hover:bg-transparent">
                          <TableHead className="text-[10px] uppercase tracking-widest text-[#9AA8BA] font-bold">SKU</TableHead>
                          <TableHead className="text-[10px] uppercase tracking-widest text-[#9AA8BA] font-bold">Produto</TableHead>
                          <TableHead className="text-[10px] uppercase tracking-widest text-[#9AA8BA] font-bold hidden md:table-cell">Categoria</TableHead>
                          <TableHead className="text-[10px] uppercase tracking-widest text-[#9AA8BA] font-bold hidden lg:table-cell">Custo</TableHead>
                          <TableHead className="text-[10px] uppercase tracking-widest text-[#9AA8BA] font-bold">Preço</TableHead>
                          <TableHead className="text-[10px] uppercase tracking-widest text-[#9AA8BA] font-bold">Estoque</TableHead>
                          <TableHead className="text-[10px] uppercase tracking-widest text-[#9AA8BA] font-bold hidden md:table-cell">Fornecedor</TableHead>
                          <TableHead className="text-[10px] uppercase tracking-widest text-[#9AA8BA] font-bold text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProducts.length === 0 && (
                          <TableRow><TableCell colSpan={8}><EmptyState icon={Package} label="Nenhum produto encontrado" /></TableCell></TableRow>
                        )}
                        {filteredProducts.map(product => (
                          <TableRow key={product.id} className="border-[#f0f4f9] hover:bg-[#fafbff]">
                            <TableCell className="font-mono text-xs text-[#9AA8BA]">{product.sku}</TableCell>
                            <TableCell className="font-semibold text-sm text-[#22324A]">{product.name}</TableCell>
                            <TableCell className="hidden md:table-cell">
                              <Badge className="bg-[#f0f4f9] text-[#7c8da4] border-0 rounded-lg text-xs shadow-none">{product.category}</Badge>
                            </TableCell>
                            <TableCell className="text-sm hidden lg:table-cell">{brl(product.cost)}</TableCell>
                            <TableCell className="text-sm font-semibold text-[#2453ff]">{brl(product.price)}</TableCell>
                            <TableCell>
                              <Badge className={`${product.stock === 0 ? "bg-[#fff1f2] text-[#ef4444] border-[#fecdd3]" : product.stock <= product.minStock ? "bg-[#fff7ed] text-[#f59e0b] border-[#fed7aa]" : "bg-[#ecfdf5] text-[#10b981] border-[#d1fae5]"} border rounded-lg text-xs font-bold shadow-none`}>
                                {product.stock === 0 ? "Esgotado" : `${product.stock} un`}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs text-[#9AA8BA] hidden md:table-cell">{supplierName(product.supplierId)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <Button size="sm" variant="outline" onClick={() => quickStockEntry(product)} className="h-7 rounded-lg text-xs border-[#e4ebf5] text-[#10b981] hover:bg-[#ecfdf5]">
                                  <ArrowUp className="w-3 h-3 mr-1" />Entrada
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => quickSell(product)} disabled={product.stock <= 0} className="h-7 rounded-lg text-xs border-[#e4ebf5] text-[#2453ff] hover:bg-[#eef4ff] disabled:opacity-40">
                                  <ShoppingCart className="w-3 h-3 mr-1" />Vender
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => openModal("product", product)} className="h-7 w-7 rounded-lg p-0 text-[#9AA8BA] hover:text-[#2453ff] hover:bg-[#eef4ff]">
                                  <Pencil className="w-3.5 h-3.5" />
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => removeItem("products", product.id)} className="h-7 w-7 rounded-lg p-0 text-[#9AA8BA] hover:text-red-500 hover:bg-[#fff1f2]">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Card>
                </div>
              )}

              {/* ════════════════════════ VENDAS ══════════════════════════ */}
              {tab === "sales" && (
                <div className="space-y-4">
                  <SectionHeader title="Histórico de Vendas" subtitle={`${db.sales.length} vendas registradas`}
                    action={<Button onClick={() => setTab("pdv")} className="rounded-xl h-9 bg-[#2453ff] hover:bg-[#1f46d6] text-white text-sm"><Store className="w-4 h-4 mr-1.5" />Nova Venda (PDV)</Button>} />
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <KPICard title="Faturamento total" value={brl(metrics.revenueMonth)} icon={Wallet} color="blue" />
                    <KPICard title="Total de vendas" value={String(db.sales.length)} icon={ClipboardList} color="green" />
                    <KPICard title="Ticket médio" value={brl(db.sales.length ? metrics.revenueMonth / db.sales.length : 0)} icon={TrendingUp} color="amber" />
                    <KPICard title="Via fiado" value={String(db.sales.filter(s => s.paymentMethod === "Fiado").length)} icon={CreditCard} color="purple" />
                  </div>
                  <SearchBar value={saleSearch} onChange={setSaleSearch} placeholder="Buscar por nº, cliente, forma de pagamento..." className="max-w-md" />
                  <Card className="rounded-[20px] border border-[#e4ebf5] bg-white overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-[#f0f4f9] hover:bg-transparent">
                          <TableHead className="text-[10px] uppercase tracking-widest text-[#9AA8BA] font-bold">Nº</TableHead>
                          <TableHead className="text-[10px] uppercase tracking-widest text-[#9AA8BA] font-bold">Data</TableHead>
                          <TableHead className="text-[10px] uppercase tracking-widest text-[#9AA8BA] font-bold">Cliente</TableHead>
                          <TableHead className="text-[10px] uppercase tracking-widest text-[#9AA8BA] font-bold hidden md:table-cell">Itens</TableHead>
                          <TableHead className="text-[10px] uppercase tracking-widest text-[#9AA8BA] font-bold hidden md:table-cell">Pagamento</TableHead>
                          <TableHead className="text-[10px] uppercase tracking-widest text-[#9AA8BA] font-bold">Total</TableHead>
                          <TableHead className="text-[10px] uppercase tracking-widest text-[#9AA8BA] font-bold text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredSales.length === 0 && (
                          <TableRow><TableCell colSpan={7}><EmptyState icon={ShoppingCart} label="Nenhuma venda encontrada" /></TableCell></TableRow>
                        )}
                        {filteredSales.map(sale => (
                          <TableRow key={sale.id} className="border-[#f0f4f9] hover:bg-[#fafbff]">
                            <TableCell className="font-mono text-xs text-[#9AA8BA]">#{sale.number}</TableCell>
                            <TableCell className="text-sm">{fmtDate(sale.date)}</TableCell>
                            <TableCell className="font-semibold text-sm text-[#22324A]">{customerName(sale.customerId)}</TableCell>
                            <TableCell className="text-xs text-[#9AA8BA] hidden md:table-cell">{sale.items?.length || 0} item(s)</TableCell>
                            <TableCell className="hidden md:table-cell">
                              <Badge className="bg-[#f0f4f9] text-[#7c8da4] border-0 rounded-lg text-xs shadow-none">{sale.paymentMethod}</Badge>
                            </TableCell>
                            <TableCell className="font-bold text-[#2453ff]">{brl(sale.total)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <Button size="sm" variant="outline" onClick={() => openModal("saleDetail", sale)} className="h-7 rounded-lg text-xs border-[#e4ebf5]">
                                  <Eye className="w-3 h-3 mr-1" />Ver
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => { setReturnForm({ ...emptyReturn, saleId: sale.id }); openModal("return"); }} className="h-7 rounded-lg text-xs border-[#e4ebf5] text-amber-600 hover:bg-amber-50">
                                  <Undo2 className="w-3 h-3 mr-1" />Devolver
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Card>
                </div>
              )}

              {/* ════════════════════════ COMPRAS ═════════════════════════ */}
              {tab === "purchases" && (
                <div className="space-y-4">
                  <SectionHeader title="Compras" subtitle="Entradas de mercadoria"
                    action={
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => openModal("supplier")} className="rounded-xl h-9 border-[#e4ebf5] text-slate-600 text-sm"><Plus className="w-4 h-4 mr-1.5" />Fornecedor</Button>
                        <Button onClick={() => openModal("purchase")} className="rounded-xl h-9 bg-[#2453ff] hover:bg-[#1f46d6] text-white text-sm"><Plus className="w-4 h-4 mr-1.5" />Nova Compra</Button>
                      </div>
                    } />
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <KPICard title="Total compras" value={String(db.purchases.length)} icon={Truck} color="blue" />
                    <KPICard title="Valor investido" value={brl(metrics.totalPurchases)} icon={DollarSign} color="amber" />
                    <KPICard title="Fornecedores" value={String(db.suppliers.length)} icon={Users} color="green" />
                    <KPICard title="Contas geradas" value={String(db.payables.length)} icon={Receipt} color="red" onClick={() => { setFinanceMode("pagar"); setTab("finance"); }} />
                  </div>
                  <SearchBar value={purchaseSearch} onChange={setPurchaseSearch} placeholder="Buscar por produto ou fornecedor..." className="max-w-md" />
                  <Card className="rounded-[20px] border border-[#e4ebf5] bg-white overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-[#f0f4f9] hover:bg-transparent">
                          <TableHead className="text-[10px] uppercase tracking-widest text-[#9AA8BA] font-bold">Data</TableHead>
                          <TableHead className="text-[10px] uppercase tracking-widest text-[#9AA8BA] font-bold">Produto</TableHead>
                          <TableHead className="text-[10px] uppercase tracking-widest text-[#9AA8BA] font-bold hidden md:table-cell">Fornecedor</TableHead>
                          <TableHead className="text-[10px] uppercase tracking-widest text-[#9AA8BA] font-bold">Qtd</TableHead>
                          <TableHead className="text-[10px] uppercase tracking-widest text-[#9AA8BA] font-bold hidden lg:table-cell">Custo/un</TableHead>
                          <TableHead className="text-[10px] uppercase tracking-widest text-[#9AA8BA] font-bold">Total</TableHead>
                          <TableHead className="text-[10px] uppercase tracking-widest text-[#9AA8BA] font-bold hidden lg:table-cell">Nota</TableHead>
                          <TableHead className="text-[10px] uppercase tracking-widest text-[#9AA8BA] font-bold text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredPurchases.length === 0 && (
                          <TableRow><TableCell colSpan={8}><EmptyState icon={Truck} label="Nenhuma compra encontrada" /></TableCell></TableRow>
                        )}
                        {filteredPurchases.map(p => (
                          <TableRow key={p.id} className="border-[#f0f4f9] hover:bg-[#fafbff]">
                            <TableCell className="text-sm">{fmtDate(p.date)}</TableCell>
                            <TableCell className="font-semibold text-sm text-[#22324A]">{productName(p.productId)}</TableCell>
                            <TableCell className="text-sm hidden md:table-cell">{supplierName(p.supplierId)}</TableCell>
                            <TableCell className="text-sm">{p.qty} un</TableCell>
                            <TableCell className="text-sm hidden lg:table-cell">{brl(p.unitCost)}</TableCell>
                            <TableCell className="font-bold text-sm text-[#10b981]">{brl(p.total)}</TableCell>
                            <TableCell className="text-xs text-[#9AA8BA] hidden lg:table-cell">{p.note || "—"}</TableCell>
                            <TableCell className="text-right">
                              <Button size="sm" variant="ghost" onClick={() => removeItem("purchases", p.id)} className="h-7 w-7 rounded-lg p-0 text-[#9AA8BA] hover:text-red-500 hover:bg-[#fff1f2]">
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Card>

                  {/* Suppliers */}
                  <SectionHeader title="Fornecedores" subtitle={`${db.suppliers.length} cadastrados`} />
                  <Card className="rounded-[20px] border border-[#e4ebf5] bg-white overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-[#f0f4f9] hover:bg-transparent">
                          <TableHead className="text-[10px] uppercase tracking-widest text-[#9AA8BA] font-bold">Nome</TableHead>
                          <TableHead className="text-[10px] uppercase tracking-widest text-[#9AA8BA] font-bold hidden md:table-cell">Contato</TableHead>
                          <TableHead className="text-[10px] uppercase tracking-widest text-[#9AA8BA] font-bold hidden md:table-cell">Telefone</TableHead>
                          <TableHead className="text-[10px] uppercase tracking-widest text-[#9AA8BA] font-bold">Categoria</TableHead>
                          <TableHead className="text-[10px] uppercase tracking-widest text-[#9AA8BA] font-bold text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {db.suppliers.map(s => (
                          <TableRow key={s.id} className="border-[#f0f4f9] hover:bg-[#fafbff]">
                            <TableCell className="font-semibold text-sm text-[#22324A]">{s.name}</TableCell>
                            <TableCell className="text-sm hidden md:table-cell">{s.contact || "—"}</TableCell>
                            <TableCell className="text-sm hidden md:table-cell">{s.phone || "—"}</TableCell>
                            <TableCell><Badge className="bg-[#f0f4f9] text-[#7c8da4] border-0 rounded-lg text-xs shadow-none">{s.category}</Badge></TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <Button size="sm" variant="outline" onClick={() => { setPurchaseForm({ ...emptyPurchase, supplierId: s.id }); openModal("purchase"); }} className="h-7 rounded-lg text-xs border-[#e4ebf5] text-[#2453ff] hover:bg-[#eef4ff]">
                                  Nova Compra
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => openModal("supplier", s)} className="h-7 w-7 rounded-lg p-0 text-[#9AA8BA] hover:text-[#2453ff] hover:bg-[#eef4ff]">
                                  <Pencil className="w-3.5 h-3.5" />
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => removeItem("suppliers", s.id)} className="h-7 w-7 rounded-lg p-0 text-[#9AA8BA] hover:text-red-500 hover:bg-[#fff1f2]">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Card>
                </div>
              )}

              {/* ════════════════════════ DEVOLUÇÕES ══════════════════════ */}
              {tab === "returns" && (
                <div className="space-y-4">
                  <SectionHeader title="Devoluções" subtitle="Controle de devoluções e estornos"
                    action={<Button onClick={() => openModal("return")} className="rounded-xl h-9 bg-[#2453ff] hover:bg-[#1f46d6] text-white text-sm"><Plus className="w-4 h-4 mr-1.5" />Registrar Devolução</Button>} />
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <KPICard title="Total devoluções" value={String(db.returns.length)} icon={Undo2} color="purple" />
                    <KPICard title="Valor devolvido" value={brl(metrics.totalReturns)} icon={Wallet} color="red" />
                    <KPICard title="Este mês" value={String(db.returns.filter(r => r.date?.startsWith(todayISO().slice(0, 7))).length)} icon={RotateCcw} color="amber" />
                    <KPICard title="Vendas com devolução" value={String(new Set(db.returns.map(r => r.saleId)).size)} icon={ShoppingCart} color="blue" onClick={() => setTab("sales")} />
                  </div>
                  <SearchBar value={returnSearch} onChange={setReturnSearch} placeholder="Buscar por produto ou motivo..." className="max-w-md" />
                  <Card className="rounded-[20px] border border-[#e4ebf5] bg-white overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-[#f0f4f9] hover:bg-transparent">
                          <TableHead className="text-[10px] uppercase tracking-widest text-[#9AA8BA] font-bold">Data</TableHead>
                          <TableHead className="text-[10px] uppercase tracking-widest text-[#9AA8BA] font-bold">Produto</TableHead>
                          <TableHead className="text-[10px] uppercase tracking-widest text-[#9AA8BA] font-bold hidden md:table-cell">Venda</TableHead>
                          <TableHead className="text-[10px] uppercase tracking-widest text-[#9AA8BA] font-bold">Qtd</TableHead>
                          <TableHead className="text-[10px] uppercase tracking-widest text-[#9AA8BA] font-bold hidden md:table-cell">Motivo</TableHead>
                          <TableHead className="text-[10px] uppercase tracking-widest text-[#9AA8BA] font-bold">Total devolvido</TableHead>
                          <TableHead className="text-[10px] uppercase tracking-widest text-[#9AA8BA] font-bold text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredReturns.length === 0 && (
                          <TableRow><TableCell colSpan={7}><EmptyState icon={Undo2} label="Nenhuma devolução registrada" /></TableCell></TableRow>
                        )}
                        {filteredReturns.map(r => {
                          const sale = db.sales.find(s => s.id === r.saleId);
                          return (
                            <TableRow key={r.id} className="border-[#f0f4f9] hover:bg-[#fafbff]">
                              <TableCell className="text-sm">{fmtDate(r.date)}</TableCell>
                              <TableCell className="font-semibold text-sm text-[#22324A]">{productName(r.productId)}</TableCell>
                              <TableCell className="hidden md:table-cell">
                                <button onClick={() => setTab("sales")} className="text-xs text-[#2453ff] hover:underline font-mono">#{sale?.number || "—"}</button>
                              </TableCell>
                              <TableCell className="text-sm">{r.qty} un</TableCell>
                              <TableCell className="text-sm hidden md:table-cell">{r.reason || "—"}</TableCell>
                              <TableCell className="font-bold text-sm text-[#ef4444]">{brl(r.total)}</TableCell>
                              <TableCell className="text-right">
                                <Button size="sm" variant="ghost" onClick={() => removeItem("returns", r.id)} className="h-7 w-7 rounded-lg p-0 text-[#9AA8BA] hover:text-red-500 hover:bg-[#fff1f2]">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </Card>
                </div>
              )}

              {/* ════════════════════════ CLIENTES ════════════════════════ */}
              {tab === "customers" && (
                <div className="space-y-4">
                  <SectionHeader title="Clientes" subtitle={`${db.customers.length} cadastrados`}
                    action={<Button onClick={() => openModal("customer")} className="rounded-xl h-9 bg-[#2453ff] hover:bg-[#1f46d6] text-white text-sm"><Plus className="w-4 h-4 mr-1.5" />Novo Cliente</Button>} />
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <KPICard title="Total clientes" value={String(db.customers.length)} icon={Users} color="blue" />
                    <KPICard title="Ativos" value={String(db.customers.filter(c => c.status === "Ativo").length)} icon={UserCheck} color="green" />
                    <KPICard title="Limite total concedido" value={brl(db.customers.reduce((s, c) => s + c.creditLimit, 0))} icon={CreditCard} color="amber" />
                    <KPICard title="A receber (fiado)" value={brl(metrics.openReceivables)} icon={Wallet} color="red" onClick={() => { setFinanceMode("receber"); setTab("finance"); }} />
                  </div>
                  <SearchBar value={customerSearch} onChange={setCustomerSearch} placeholder="Buscar por nome, telefone ou cidade..." className="max-w-md" />
                  <Card className="rounded-[20px] border border-[#e4ebf5] bg-white overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-[#f0f4f9] hover:bg-transparent">
                          <TableHead className="text-[10px] uppercase tracking-widest text-[#9AA8BA] font-bold">Nome</TableHead>
                          <TableHead className="text-[10px] uppercase tracking-widest text-[#9AA8BA] font-bold hidden md:table-cell">Telefone</TableHead>
                          <TableHead className="text-[10px] uppercase tracking-widest text-[#9AA8BA] font-bold hidden lg:table-cell">Cidade</TableHead>
                          <TableHead className="text-[10px] uppercase tracking-widest text-[#9AA8BA] font-bold">Crédito</TableHead>
                          <TableHead className="text-[10px] uppercase tracking-widest text-[#9AA8BA] font-bold">Status</TableHead>
                          <TableHead className="text-[10px] uppercase tracking-widest text-[#9AA8BA] font-bold text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCustomers.length === 0 && (
                          <TableRow><TableCell colSpan={6}><EmptyState icon={Users} label="Nenhum cliente encontrado" /></TableCell></TableRow>
                        )}
                        {filteredCustomers.map(c => (
                          <TableRow key={c.id} className="border-[#f0f4f9] hover:bg-[#fafbff]">
                            <TableCell className="font-semibold text-sm text-[#22324A]">{c.name}</TableCell>
                            <TableCell className="text-sm hidden md:table-cell">{c.phone || "—"}</TableCell>
                            <TableCell className="text-sm hidden lg:table-cell">{c.city || "—"}</TableCell>
                            <TableCell className="text-sm">{c.creditLimit > 0 ? brl(c.creditLimit) : "—"}</TableCell>
                            <TableCell><StatusBadge status={c.status} /></TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <Button size="sm" variant="outline" onClick={() => { setFinanceMode("receber"); setFinanceSearch(c.name); setTab("finance"); }} className="h-7 rounded-lg text-xs border-[#e4ebf5] text-[#f59e0b] hover:bg-amber-50">
                                  Fiado
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => openModal("customer", c)} className="h-7 w-7 rounded-lg p-0 text-[#9AA8BA] hover:text-[#2453ff] hover:bg-[#eef4ff]">
                                  <Pencil className="w-3.5 h-3.5" />
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => removeItem("customers", c.id)} className="h-7 w-7 rounded-lg p-0 text-[#9AA8BA] hover:text-red-500 hover:bg-[#fff1f2]">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Card>
                </div>
              )}

              {/* ════════════════════════ FINANCEIRO ══════════════════════ */}
              {tab === "finance" && (
                <div className="space-y-4">
                  <SectionHeader title="Financeiro" subtitle="Contas a receber e a pagar"
                    action={
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => openModal("receivable")} className="rounded-xl h-9 border-[#e4ebf5] text-[#10b981] text-sm">
                          <ArrowDown className="w-4 h-4 mr-1.5" />Nova Receita
                        </Button>
                        <Button onClick={() => openModal("payable")} className="rounded-xl h-9 bg-[#ef4444] hover:bg-red-600 text-white text-sm">
                          <ArrowUp className="w-4 h-4 mr-1.5" />Nova Despesa
                        </Button>
                      </div>
                    } />

                  {/* KPIs */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <KPICard title="A receber (aberto)" value={brl(db.receivables.filter(r => r.status === "Aberto").reduce((s, r) => s + r.amount, 0))} icon={ArrowDown} color="green" onClick={() => setFinanceMode("receber")} />
                    <KPICard title="A pagar (aberto)" value={brl(db.payables.filter(p => p.status === "Aberto").reduce((s, p) => s + p.amount, 0))} icon={ArrowUp} color="red" onClick={() => setFinanceMode("pagar")} />
                    <KPICard title="Recebido (pago)" value={brl(db.receivables.filter(r => r.status === "Pago").reduce((s, r) => s + r.amount, 0))} icon={CheckCircle} color="blue" />
                    <KPICard title="Pago (despesas)" value={brl(db.payables.filter(p => p.status === "Pago").reduce((s, p) => s + p.amount, 0))} icon={CheckCircle} color="amber" />
                  </div>

                  {/* Toggle + search */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex bg-[#f5f7fb] border border-[#e4ebf5] rounded-xl p-1 gap-1">
                      <button onClick={() => setFinanceMode("receber")} className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${financeMode === "receber" ? "bg-white text-[#10b981] shadow-sm" : "text-[#9AA8BA] hover:text-slate-600"}`}>
                        <ArrowDown className="w-3.5 h-3.5 inline mr-1.5" />A Receber
                      </button>
                      <button onClick={() => setFinanceMode("pagar")} className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${financeMode === "pagar" ? "bg-white text-[#ef4444] shadow-sm" : "text-[#9AA8BA] hover:text-slate-600"}`}>
                        <ArrowUp className="w-3.5 h-3.5 inline mr-1.5" />A Pagar
                      </button>
                    </div>
                    <SearchBar value={financeSearch} onChange={setFinanceSearch} placeholder={financeMode === "receber" ? "Buscar por descrição ou cliente..." : "Buscar por descrição ou fornecedor..."} className="flex-1 max-w-md" />
                  </div>

                  <Card className="rounded-[20px] border border-[#e4ebf5] bg-white overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-[#f0f4f9] hover:bg-transparent">
                          <TableHead className="text-[10px] uppercase tracking-widest text-[#9AA8BA] font-bold">Descrição</TableHead>
                          <TableHead className="text-[10px] uppercase tracking-widest text-[#9AA8BA] font-bold hidden md:table-cell">{financeMode === "receber" ? "Cliente" : "Fornecedor"}</TableHead>
                          <TableHead className="text-[10px] uppercase tracking-widest text-[#9AA8BA] font-bold">Valor</TableHead>
                          <TableHead className="text-[10px] uppercase tracking-widest text-[#9AA8BA] font-bold hidden md:table-cell">Vencimento</TableHead>
                          <TableHead className="text-[10px] uppercase tracking-widest text-[#9AA8BA] font-bold">Status</TableHead>
                          <TableHead className="text-[10px] uppercase tracking-widest text-[#9AA8BA] font-bold text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredFinance.length === 0 && (
                          <TableRow><TableCell colSpan={6}><EmptyState icon={Wallet} label="Nenhum registro encontrado" /></TableCell></TableRow>
                        )}
                        {filteredFinance.map(item => {
                          const type = financeMode === "receber" ? "receivables" : "payables";
                          const party = financeMode === "receber" ? customerName(item.customerId) : item.supplier;
                          const isOverdue = item.status === "Aberto" && item.dueDate < todayISO();
                          return (
                            <TableRow key={item.id} className="border-[#f0f4f9] hover:bg-[#fafbff]">
                              <TableCell className="font-semibold text-sm text-[#22324A]">{item.description}</TableCell>
                              <TableCell className="text-sm hidden md:table-cell">
                                {financeMode === "receber" && item.customerId ? (
                                  <button onClick={() => { setCustomerSearch(party); setTab("customers"); }} className="text-[#2453ff] hover:underline">{party}</button>
                                ) : <span className="text-[#9AA8BA]">{party || "—"}</span>}
                              </TableCell>
                              <TableCell className={`font-bold text-sm ${financeMode === "receber" ? "text-[#10b981]" : "text-[#ef4444]"}`}>{brl(item.amount)}</TableCell>
                              <TableCell className={`text-sm hidden md:table-cell ${isOverdue ? "text-[#ef4444] font-semibold" : ""}`}>{fmtDate(item.dueDate)}</TableCell>
                              <TableCell><StatusBadge status={isOverdue ? "Vencido" : item.status} /></TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  {item.status === "Aberto" && (
                                    <Button size="sm" variant="outline" onClick={() => markPaid(type, item.id)} className="h-7 rounded-lg text-xs border-[#e4ebf5] text-[#10b981] hover:bg-[#ecfdf5]">
                                      <CheckCircle className="w-3 h-3 mr-1" />Baixar
                                    </Button>
                                  )}
                                  <Button size="sm" variant="ghost" onClick={() => openModal(financeMode === "receber" ? "receivable" : "payable", item)} className="h-7 w-7 rounded-lg p-0 text-[#9AA8BA] hover:text-[#2453ff] hover:bg-[#eef4ff]">
                                    <Pencil className="w-3.5 h-3.5" />
                                  </Button>
                                  <Button size="sm" variant="ghost" onClick={() => removeItem(type, item.id)} className="h-7 w-7 rounded-lg p-0 text-[#9AA8BA] hover:text-red-500 hover:bg-[#fff1f2]">
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </Card>
                </div>
              )}

              {/* ════════════════════════ RELATÓRIOS ══════════════════════ */}
              {tab === "reports" && (
                <div className="space-y-4">
                  <SectionHeader title="Relatórios" subtitle="Visão analítica do negócio" />
                  <div className="flex bg-[#f5f7fb] border border-[#e4ebf5] rounded-xl p-1 gap-1 w-fit">
                    {["geral", "comercial", "financeiro"].map(v => (
                      <button key={v} onClick={() => setReportView(v)} className={`px-5 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${reportView === v ? "bg-white text-[#2453ff] shadow-sm" : "text-[#9AA8BA] hover:text-slate-600"}`}>{v}</button>
                    ))}
                  </div>

                  {reportView === "geral" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <KPICard title="Faturamento total" value={brl(metrics.revenueMonth)} icon={Wallet} color="blue" onClick={() => setTab("sales")} />
                        <KPICard title="Custo de compras" value={brl(metrics.totalPurchases)} icon={Truck} color="amber" onClick={() => setTab("purchases")} />
                        <KPICard title="Margem bruta" value={brl(metrics.revenueMonth - metrics.totalPurchases)} icon={TrendingUp} color="green" />
                        <KPICard title="Devoluções" value={brl(metrics.totalReturns)} icon={Undo2} color="red" onClick={() => setTab("returns")} />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="rounded-[20px] border border-[#e4ebf5] bg-white p-5">
                          <h3 className="text-sm font-bold text-[#1B2A41] mb-4">Resumo Operacional</h3>
                          <div className="space-y-3">
                            {[
                              { label: "Produtos cadastrados", value: db.products.length, link: "products" },
                              { label: "Clientes ativos", value: db.customers.filter(c => c.status === "Ativo").length, link: "customers" },
                              { label: "Fornecedores", value: db.suppliers.length, link: "purchases" },
                              { label: "Vendas realizadas", value: db.sales.length, link: "sales" },
                              { label: "Devoluções", value: db.returns.length, link: "returns" },
                              { label: "SKUs com estoque crítico", value: metrics.lowStock, link: "products" },
                            ].map(row => (
                              <button key={row.label} onClick={() => setTab(row.link)} className="w-full flex items-center justify-between py-2 border-b border-[#f0f4f9] last:border-0 hover:text-[#2453ff] transition-colors text-left">
                                <span className="text-sm text-[#7c8da4]">{row.label}</span>
                                <span className="text-sm font-bold text-[#1B2A41]">{row.value}</span>
                              </button>
                            ))}
                          </div>
                        </Card>
                        <Card className="rounded-[20px] border border-[#e4ebf5] bg-white p-5">
                          <h3 className="text-sm font-bold text-[#1B2A41] mb-4">Resultado do Período</h3>
                          <div className="space-y-3">
                            {[
                              { label: "Receita bruta (vendas)", value: brl(metrics.revenueMonth), color: "text-[#10b981]" },
                              { label: "Devoluções (−)", value: `− ${brl(metrics.totalReturns)}`, color: "text-[#ef4444]" },
                              { label: "Receita líquida", value: brl(metrics.revenueMonth - metrics.totalReturns), color: "text-[#2453ff]" },
                              { label: "Custo de mercadoria (CMV)", value: `− ${brl(metrics.totalPurchases)}`, color: "text-[#ef4444]" },
                              { label: "Lucro bruto estimado", value: brl(metrics.revenueMonth - metrics.totalReturns - metrics.totalPurchases), color: "text-[#1B2A41] font-extrabold" },
                            ].map(row => (
                              <div key={row.label} className="flex items-center justify-between py-2 border-b border-[#f0f4f9] last:border-0">
                                <span className="text-sm text-[#7c8da4]">{row.label}</span>
                                <span className={`text-sm font-semibold ${row.color}`}>{row.value}</span>
                              </div>
                            ))}
                          </div>
                        </Card>
                      </div>
                    </div>
                  )}

                  {reportView === "comercial" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="rounded-[20px] border border-[#e4ebf5] bg-white p-5">
                          <h3 className="text-sm font-bold text-[#1B2A41] mb-4">Top Clientes por Volume</h3>
                          {(() => {
                            const byCustomer = db.sales.reduce((acc, sale) => {
                              const name = customerName(sale.customerId);
                              acc[name] = (acc[name] || 0) + sale.total;
                              return acc;
                            }, {});
                            const sorted = Object.entries(byCustomer).sort((a, b) => b[1] - a[1]).slice(0, 6);
                            return sorted.length === 0 ? <EmptyState icon={Users} label="Sem dados ainda" /> : (
                              <div className="space-y-2">
                                {sorted.map(([name, total]) => (
                                  <button key={name} onClick={() => { setCustomerSearch(name); setTab("customers"); }} className="w-full flex items-center gap-3 hover:bg-[#f9fbff] p-2 rounded-xl text-left">
                                    <div className="flex-1">
                                      <p className="text-sm font-semibold text-[#22324A]">{name}</p>
                                      <div className="h-1.5 bg-[#f0f4f9] rounded-full mt-1">
                                        <div className="h-full bg-[#2453ff] rounded-full" style={{ width: `${(total / sorted[0][1]) * 100}%` }} />
                                      </div>
                                    </div>
                                    <span className="text-sm font-bold text-[#2453ff]">{brl(total)}</span>
                                  </button>
                                ))}
                              </div>
                            );
                          })()}
                        </Card>
                        <Card className="rounded-[20px] border border-[#e4ebf5] bg-white p-5">
                          <h3 className="text-sm font-bold text-[#1B2A41] mb-4">Formas de Pagamento</h3>
                          {(() => {
                            const byMethod = db.sales.reduce((acc, sale) => {
                              acc[sale.paymentMethod] = (acc[sale.paymentMethod] || 0) + sale.total;
                              return acc;
                            }, {});
                            const total = Object.values(byMethod).reduce((s, v) => s + v, 0) || 1;
                            const colors = { PIX: "#2453ff", Dinheiro: "#f59e0b", "Cartão Crédito": "#10b981", "Cartão Débito": "#8b5cf6", Fiado: "#ef4444", Transferência: "#06b6d4" };
                            return Object.entries(byMethod).length === 0 ? <EmptyState icon={CreditCard} label="Sem dados ainda" /> : (
                              <div className="space-y-2">
                                {Object.entries(byMethod).map(([method, value]) => (
                                  <div key={method} className="flex items-center gap-3 p-2">
                                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: colors[method] || "#9AA8BA" }} />
                                    <div className="flex-1">
                                      <div className="flex justify-between text-sm">
                                        <span className="font-semibold text-[#22324A]">{method}</span>
                                        <span className="text-[#9AA8BA]">{Math.round((value / total) * 100)}%</span>
                                      </div>
                                      <div className="h-1.5 bg-[#f0f4f9] rounded-full mt-1">
                                        <div className="h-full rounded-full" style={{ width: `${(value / total) * 100}%`, background: colors[method] || "#9AA8BA" }} />
                                      </div>
                                    </div>
                                    <span className="text-sm font-bold text-[#1B2A41]">{brl(value)}</span>
                                  </div>
                                ))}
                              </div>
                            );
                          })()}
                        </Card>
                      </div>
                    </div>
                  )}

                  {reportView === "financeiro" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="rounded-[20px] border border-[#e4ebf5] bg-white p-5">
                        <h3 className="text-sm font-bold text-[#1B2A41] mb-4">Contas a Receber</h3>
                        <div className="space-y-2">
                          {db.receivables.length === 0 ? <EmptyState icon={ArrowDown} label="Nenhuma conta" /> : db.receivables.slice(0, 8).map(r => (
                            <button key={r.id} onClick={() => { setFinanceMode("receber"); setTab("finance"); }} className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[#f9fbff] text-left">
                              <div>
                                <p className="text-sm font-semibold text-[#22324A]">{r.description}</p>
                                <p className="text-xs text-[#9AA8BA]">Vence {fmtDate(r.dueDate)}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-bold text-[#10b981]">{brl(r.amount)}</p>
                                <StatusBadge status={r.status} />
                              </div>
                            </button>
                          ))}
                        </div>
                      </Card>
                      <Card className="rounded-[20px] border border-[#e4ebf5] bg-white p-5">
                        <h3 className="text-sm font-bold text-[#1B2A41] mb-4">Contas a Pagar</h3>
                        <div className="space-y-2">
                          {db.payables.length === 0 ? <EmptyState icon={ArrowUp} label="Nenhuma conta" /> : db.payables.slice(0, 8).map(p => (
                            <button key={p.id} onClick={() => { setFinanceMode("pagar"); setTab("finance"); }} className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[#f9fbff] text-left">
                              <div>
                                <p className="text-sm font-semibold text-[#22324A]">{p.description}</p>
                                <p className="text-xs text-[#9AA8BA]">{p.supplier} · {fmtDate(p.dueDate)}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-bold text-[#ef4444]">{brl(p.amount)}</p>
                                <StatusBadge status={p.status} />
                              </div>
                            </button>
                          ))}
                        </div>
                      </Card>
                    </div>
                  )}
                </div>
              )}

              {/* ════════════════════════ CHAT ════════════════════════════ */}
              {tab === "chat" && (
                <div className="space-y-4">
                  <SectionHeader title="Mensagens" subtitle="Comunicação interna da equipe" />
                  <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr] gap-4 h-[calc(100vh-280px)]">
                    {/* Thread list */}
                    <Card className="rounded-[20px] border border-[#e4ebf5] bg-white overflow-hidden flex flex-col">
                      <div className="p-4 border-b border-[#f0f4f9]">
                        <p className="text-sm font-bold text-[#1B2A41]">Conversas</p>
                      </div>
                      <div className="flex-1 overflow-y-auto">
                        {db.chatThreads.map(thread => (
                          <button key={thread.id} onClick={() => setSelectedThreadId(thread.id)}
                            className={`w-full p-4 text-left border-b border-[#f0f4f9] hover:bg-[#f9fbff] transition-colors ${selectedThreadId === thread.id ? "bg-[#eef4ff]" : ""}`}>
                            <p className={`text-sm font-semibold ${selectedThreadId === thread.id ? "text-[#2453ff]" : "text-[#22324A]"}`}>{thread.title}</p>
                            <p className="text-xs text-[#9AA8BA] mt-0.5 truncate">{thread.messages.at(-1)?.text || "..."}</p>
                          </button>
                        ))}
                      </div>
                    </Card>

                    {/* Message area */}
                    <Card className="rounded-[20px] border border-[#e4ebf5] bg-white flex flex-col overflow-hidden">
                      {activeThread ? (
                        <>
                          <div className="p-4 border-b border-[#f0f4f9] flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-[#eef4ff] flex items-center justify-center"><MessageSquare className="w-4 h-4 text-[#2453ff]" /></div>
                            <div>
                              <p className="text-sm font-bold text-[#1B2A41]">{activeThread.title}</p>
                              <p className="text-xs text-[#9AA8BA]">{activeThread.messages.length} mensagens</p>
                            </div>
                          </div>
                          <ScrollArea className="flex-1 p-4">
                            <div className="space-y-3">
                              {activeThread.messages.map(msg => {
                                const isMe = msg.sender === "Administrador";
                                return (
                                  <div key={msg.id} className={`flex gap-2 ${isMe ? "flex-row-reverse" : ""}`}>
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${isMe ? "bg-[#2453ff] text-white" : "bg-[#f0f4f9] text-[#7c8da4]"}`}>
                                      {msg.sender.slice(0, 2).toUpperCase()}
                                    </div>
                                    <div className={`max-w-xs ${isMe ? "items-end" : ""} flex flex-col`}>
                                      <div className={`px-3 py-2 rounded-2xl text-sm ${isMe ? "bg-[#2453ff] text-white rounded-tr-sm" : "bg-[#f5f7fb] text-[#22324A] rounded-tl-sm"}`}>
                                        {msg.text}
                                      </div>
                                      <p className="text-[10px] text-[#9AA8BA] mt-1">{msg.sender} · {fmtDatetime(msg.at)}</p>
                                    </div>
                                  </div>
                                );
                              })}
                              <div ref={chatEndRef} />
                            </div>
                          </ScrollArea>
                          <div className="p-4 border-t border-[#f0f4f9] flex gap-2">
                            <Input value={chatMessage} onChange={e => setChatMessage(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendChatMessage()} placeholder="Digite uma mensagem..." className="rounded-xl border-[#e4ebf5] text-sm" />
                            <Button onClick={sendChatMessage} disabled={!chatMessage.trim()} className="rounded-xl bg-[#2453ff] hover:bg-[#1f46d6] text-white px-4 disabled:opacity-40">
                              <Send className="w-4 h-4" />
                            </Button>
                          </div>
                        </>
                      ) : <EmptyState icon={MessageSquare} label="Selecione uma conversa" />}
                    </Card>
                  </div>
                </div>
              )}

              {/* ════════════════════════ ADMIN ═══════════════════════════ */}
              {tab === "admin" && (
                <div className="space-y-4">
                  <SectionHeader title="Configurações" subtitle="Usuários, permissões, logs e backup" />
                  <div className="flex bg-[#f5f7fb] border border-[#e4ebf5] rounded-xl p-1 gap-1 w-fit flex-wrap">
                    {[
                      { key: "usuarios", label: "Usuários", icon: Users },
                      { key: "permissoes", label: "Permissões", icon: Shield },
                      { key: "logs", label: "Logs", icon: FileText },
                      { key: "backup", label: "Backup", icon: Database },
                    ].map(v => {
                      const Icon = v.icon;
                      return (
                        <button key={v.key} onClick={() => setAdminView(v.key)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${adminView === v.key ? "bg-white text-[#2453ff] shadow-sm" : "text-[#9AA8BA] hover:text-slate-600"}`}>
                          <Icon className="w-3.5 h-3.5" />{v.label}
                        </button>
                      );
                    })}
                  </div>

                  {adminView === "usuarios" && (
                    <div className="space-y-4">
                      <div className="flex justify-end">
                        <Button onClick={() => openModal("user")} className="rounded-xl h-9 bg-[#2453ff] hover:bg-[#1f46d6] text-white text-sm"><Plus className="w-4 h-4 mr-1.5" />Novo Usuário</Button>
                      </div>
                      <Card className="rounded-[20px] border border-[#e4ebf5] bg-white overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow className="border-[#f0f4f9] hover:bg-transparent">
                              <TableHead className="text-[10px] uppercase tracking-widest text-[#9AA8BA] font-bold">Nome</TableHead>
                              <TableHead className="text-[10px] uppercase tracking-widest text-[#9AA8BA] font-bold">E-mail</TableHead>
                              <TableHead className="text-[10px] uppercase tracking-widest text-[#9AA8BA] font-bold">Perfil</TableHead>
                              <TableHead className="text-[10px] uppercase tracking-widest text-[#9AA8BA] font-bold">Status</TableHead>
                              <TableHead className="text-[10px] uppercase tracking-widest text-[#9AA8BA] font-bold text-right">Ações</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {db.users.map(user => (
                              <TableRow key={user.id} className="border-[#f0f4f9] hover:bg-[#fafbff]">
                                <TableCell className="font-semibold text-sm text-[#22324A]">{user.name}</TableCell>
                                <TableCell className="text-sm text-[#9AA8BA]">{user.email}</TableCell>
                                <TableCell>
                                  <Badge className="bg-[#eef4ff] text-[#2453ff] border-0 rounded-lg text-xs shadow-none">{user.role}</Badge>
                                </TableCell>
                                <TableCell><StatusBadge status={user.status} /></TableCell>
                                <TableCell className="text-right">
                                  <Button size="sm" variant="ghost" onClick={() => openModal("user", user)} className="h-7 w-7 rounded-lg p-0 text-[#9AA8BA] hover:text-[#2453ff] hover:bg-[#eef4ff]">
                                    <Pencil className="w-3.5 h-3.5" />
                                  </Button>
                                  <Button size="sm" variant="ghost" onClick={() => removeItem("users", user.id)} className="h-7 w-7 rounded-lg p-0 text-[#9AA8BA] hover:text-red-500 hover:bg-[#fff1f2]">
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Card>
                    </div>
                  )}

                  {adminView === "permissoes" && (
                    <Card className="rounded-[20px] border border-[#e4ebf5] bg-white overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-[#f0f4f9] hover:bg-transparent">
                            <TableHead className="text-[10px] uppercase tracking-widest text-[#9AA8BA] font-bold">Perfil</TableHead>
                            <TableHead className="text-[10px] uppercase tracking-widest text-[#9AA8BA] font-bold">Módulos com Acesso</TableHead>
                            <TableHead className="text-[10px] uppercase tracking-widest text-[#9AA8BA] font-bold">Qtd</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {db.permissions.map(perm => (
                            <TableRow key={perm.role} className="border-[#f0f4f9] hover:bg-[#fafbff]">
                              <TableCell className="font-semibold text-sm text-[#22324A] w-36">{perm.role}</TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {perm.modules.map(m => (
                                    <Badge key={m} className="bg-[#f0f4f9] text-[#7c8da4] border-0 rounded-md text-[10px] shadow-none capitalize">{m}</Badge>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell className="text-sm text-[#9AA8BA]">{perm.modules.length}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Card>
                  )}

                  {adminView === "logs" && (
                    <Card className="rounded-[20px] border border-[#e4ebf5] bg-white overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-[#f0f4f9] hover:bg-transparent">
                            <TableHead className="text-[10px] uppercase tracking-widest text-[#9AA8BA] font-bold">Data/Hora</TableHead>
                            <TableHead className="text-[10px] uppercase tracking-widest text-[#9AA8BA] font-bold">Ação</TableHead>
                            <TableHead className="text-[10px] uppercase tracking-widest text-[#9AA8BA] font-bold">Módulo</TableHead>
                            <TableHead className="text-[10px] uppercase tracking-widest text-[#9AA8BA] font-bold">Detalhe</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {db.logs.length === 0 && (
                            <TableRow><TableCell colSpan={4}><EmptyState icon={FileText} label="Nenhum log registrado" /></TableCell></TableRow>
                          )}
                          {db.logs.slice(0, 50).map(log => (
                            <TableRow key={log.id} className="border-[#f0f4f9] hover:bg-[#fafbff]">
                              <TableCell className="text-xs font-mono text-[#9AA8BA]">{fmtDatetime(log.at)}</TableCell>
                              <TableCell className="text-sm font-semibold text-[#22324A]">{log.action}</TableCell>
                              <TableCell><Badge className="bg-[#f0f4f9] text-[#7c8da4] border-0 rounded-md text-xs shadow-none">{log.module}</Badge></TableCell>
                              <TableCell className="text-xs text-[#9AA8BA]">{log.detail}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Card>
                  )}

                  {adminView === "backup" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="rounded-[20px] border border-[#e4ebf5] bg-white p-6">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-[14px] bg-[#eef4ff] flex items-center justify-center">
                              <Download className="w-5 h-5 text-[#2453ff]" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-[#1B2A41]">Exportar Backup</h3>
                              <p className="text-sm text-[#9AA8BA] mt-1">Baixe todos os dados do sistema em formato JSON. Salve em local seguro.</p>
                              <Button onClick={createBackup} className="mt-4 rounded-xl bg-[#2453ff] hover:bg-[#1f46d6] text-white text-sm">
                                <Download className="w-4 h-4 mr-2" />Criar e Baixar Backup
                              </Button>
                            </div>
                          </div>
                        </Card>
                        <Card className="rounded-[20px] border border-[#e4ebf5] bg-white p-6">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-[14px] bg-[#ecfdf5] flex items-center justify-center">
                              <Upload className="w-5 h-5 text-[#10b981]" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-[#1B2A41]">Importar Backup</h3>
                              <p className="text-sm text-[#9AA8BA] mt-1">Restaure um backup anterior. Atenção: os dados atuais serão substituídos.</p>
                              <input ref={fileInputRef} type="file" accept=".json" onChange={importBackup} className="hidden" />
                              <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="mt-4 rounded-xl border-[#e4ebf5] text-[#10b981] text-sm">
                                <Upload className="w-4 h-4 mr-2" />Selecionar Arquivo
                              </Button>
                            </div>
                          </div>
                        </Card>
                      </div>
                      {db.backups.length > 0 && (
                        <Card className="rounded-[20px] border border-[#e4ebf5] bg-white overflow-hidden">
                          <div className="p-4 border-b border-[#f0f4f9]">
                            <p className="text-sm font-bold text-[#1B2A41]">Histórico de Backups</p>
                          </div>
                          <Table>
                            <TableBody>
                              {db.backups.map(b => (
                                <TableRow key={b.id} className="border-[#f0f4f9] hover:bg-[#fafbff]">
                                  <TableCell className="text-sm font-semibold text-[#22324A]">{b.label}</TableCell>
                                  <TableCell className="text-xs text-[#9AA8BA]">{fmtDatetime(b.at)}</TableCell>
                                  <TableCell className="text-xs text-[#9AA8BA]">{(b.size / 1024).toFixed(1)} KB</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Card>
                      )}
                    </div>
                  )}
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* ════════════════════════ MODAIS ══════════════════════════════════════ */}

      {/* Produto */}
      <Dialog open={modal === "product"} onOpenChange={open => !open && closeModal()}>
        <DialogContent className="rounded-[20px] max-w-lg">
          <DialogHeader><DialogTitle>{modalData ? "Editar Produto" : "Novo Produto"}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-xs">SKU *</Label><Input className="mt-1 rounded-xl" value={productForm.sku} onChange={e => setProductForm(f => ({ ...f, sku: e.target.value }))} placeholder="AV-001" /></div>
            <div><Label className="text-xs">Categoria</Label>
              <Select value={productForm.category} onValueChange={v => setProductForm(f => ({ ...f, category: v }))}>
                <SelectTrigger className="mt-1 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="col-span-2"><Label className="text-xs">Nome do Produto *</Label><Input className="mt-1 rounded-xl" value={productForm.name} onChange={e => setProductForm(f => ({ ...f, name: e.target.value }))} placeholder="Nome do produto" /></div>
            <div><Label className="text-xs">Custo (R$)</Label><Input type="number" className="mt-1 rounded-xl" value={productForm.cost} onChange={e => setProductForm(f => ({ ...f, cost: e.target.value }))} placeholder="0,00" /></div>
            <div><Label className="text-xs">Preço de Venda (R$)</Label><Input type="number" className="mt-1 rounded-xl" value={productForm.price} onChange={e => setProductForm(f => ({ ...f, price: e.target.value }))} placeholder="0,00" /></div>
            <div><Label className="text-xs">Estoque Inicial</Label><Input type="number" className="mt-1 rounded-xl" value={productForm.stock} onChange={e => setProductForm(f => ({ ...f, stock: e.target.value }))} placeholder="0" /></div>
            <div><Label className="text-xs">Estoque Mínimo</Label><Input type="number" className="mt-1 rounded-xl" value={productForm.minStock} onChange={e => setProductForm(f => ({ ...f, minStock: e.target.value }))} placeholder="0" /></div>
            <div className="col-span-2"><Label className="text-xs">Fornecedor</Label>
              <Select value={productForm.supplierId} onValueChange={v => setProductForm(f => ({ ...f, supplierId: v }))}>
                <SelectTrigger className="mt-1 rounded-xl"><SelectValue placeholder="Selecionar fornecedor" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">— Nenhum —</SelectItem>
                  {db.suppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="mt-2">
            <Button variant="outline" onClick={closeModal} className="rounded-xl">Cancelar</Button>
            <Button onClick={addProduct} className="rounded-xl bg-[#2453ff] hover:bg-[#1f46d6] text-white">{modalData ? "Atualizar Produto" : "Salvar Produto"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cliente */}
      <Dialog open={modal === "customer"} onOpenChange={open => !open && closeModal()}>
        <DialogContent className="rounded-[20px] max-w-md">
          <DialogHeader><DialogTitle>{modalData ? "Editar Cliente" : "Novo Cliente"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label className="text-xs">Nome *</Label><Input className="mt-1 rounded-xl" value={customerForm.name} onChange={e => setCustomerForm(f => ({ ...f, name: e.target.value }))} placeholder="Nome do cliente" /></div>
            <div><Label className="text-xs">Telefone</Label><Input className="mt-1 rounded-xl" value={customerForm.phone} onChange={e => setCustomerForm(f => ({ ...f, phone: e.target.value }))} placeholder="(92) 99999-9999" /></div>
            <div><Label className="text-xs">Cidade</Label><Input className="mt-1 rounded-xl" value={customerForm.city} onChange={e => setCustomerForm(f => ({ ...f, city: e.target.value }))} /></div>
            <div><Label className="text-xs">Limite de Crédito (Fiado)</Label><Input type="number" className="mt-1 rounded-xl" value={customerForm.creditLimit} onChange={e => setCustomerForm(f => ({ ...f, creditLimit: e.target.value }))} placeholder="0,00" /></div>
            <div><Label className="text-xs">Status</Label>
              <Select value={customerForm.status} onValueChange={v => setCustomerForm(f => ({ ...f, status: v }))}>
                <SelectTrigger className="mt-1 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="Ativo">Ativo</SelectItem><SelectItem value="Inativo">Inativo</SelectItem></SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="mt-2">
            <Button variant="outline" onClick={closeModal} className="rounded-xl">Cancelar</Button>
            <Button onClick={addCustomer} className="rounded-xl bg-[#2453ff] hover:bg-[#1f46d6] text-white">{modalData ? "Atualizar Cliente" : "Salvar Cliente"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Fornecedor */}
      <Dialog open={modal === "supplier"} onOpenChange={open => !open && closeModal()}>
        <DialogContent className="rounded-[20px] max-w-md">
          <DialogHeader><DialogTitle>{modalData ? "Editar Fornecedor" : "Novo Fornecedor"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label className="text-xs">Nome *</Label><Input className="mt-1 rounded-xl" value={supplierForm.name} onChange={e => setSupplierForm(f => ({ ...f, name: e.target.value }))} placeholder="Nome do fornecedor" /></div>
            <div><Label className="text-xs">Contato</Label><Input className="mt-1 rounded-xl" value={supplierForm.contact} onChange={e => setSupplierForm(f => ({ ...f, contact: e.target.value }))} placeholder="Nome do responsável" /></div>
            <div><Label className="text-xs">Telefone</Label><Input className="mt-1 rounded-xl" value={supplierForm.phone} onChange={e => setSupplierForm(f => ({ ...f, phone: e.target.value }))} placeholder="(11) 99999-9999" /></div>
            <div><Label className="text-xs">Categoria</Label>
              <Select value={supplierForm.category} onValueChange={v => setSupplierForm(f => ({ ...f, category: v }))}>
                <SelectTrigger className="mt-1 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="mt-2">
            <Button variant="outline" onClick={closeModal} className="rounded-xl">Cancelar</Button>
            <Button onClick={addSupplier} className="rounded-xl bg-[#2453ff] hover:bg-[#1f46d6] text-white">{modalData ? "Atualizar Fornecedor" : "Salvar Fornecedor"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Usuário */}
      <Dialog open={modal === "user"} onOpenChange={open => !open && closeModal()}>
        <DialogContent className="rounded-[20px] max-w-md">
          <DialogHeader><DialogTitle>{modalData ? "Editar Usuário" : "Novo Usuário"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label className="text-xs">Nome *</Label><Input className="mt-1 rounded-xl" value={userForm.name} onChange={e => setUserForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div><Label className="text-xs">E-mail *</Label><Input type="email" className="mt-1 rounded-xl" value={userForm.email} onChange={e => setUserForm(f => ({ ...f, email: e.target.value }))} /></div>
            <div><Label className="text-xs">Perfil</Label>
              <Select value={userForm.role} onValueChange={v => setUserForm(f => ({ ...f, role: v }))}>
                <SelectTrigger className="mt-1 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>{ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label className="text-xs">Status</Label>
              <Select value={userForm.status} onValueChange={v => setUserForm(f => ({ ...f, status: v }))}>
                <SelectTrigger className="mt-1 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="Ativo">Ativo</SelectItem><SelectItem value="Inativo">Inativo</SelectItem></SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="mt-2">
            <Button variant="outline" onClick={closeModal} className="rounded-xl">Cancelar</Button>
            <Button onClick={addUser} className="rounded-xl bg-[#2453ff] hover:bg-[#1f46d6] text-white">{modalData ? "Atualizar Usuário" : "Salvar Usuário"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Conta a Pagar */}
      <Dialog open={modal === "payable"} onOpenChange={open => !open && closeModal()}>
        <DialogContent className="rounded-[20px] max-w-md">
          <DialogHeader><DialogTitle>{modalData ? "Editar Conta a Pagar" : "Nova Conta a Pagar"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label className="text-xs">Descrição *</Label><Input className="mt-1 rounded-xl" value={payableForm.description} onChange={e => setPayableForm(f => ({ ...f, description: e.target.value }))} placeholder="Ex: Aluguel, Fornecedor..." /></div>
            <div><Label className="text-xs">Fornecedor / Credor</Label><Input className="mt-1 rounded-xl" value={payableForm.supplier} onChange={e => setPayableForm(f => ({ ...f, supplier: e.target.value }))} /></div>
            <div><Label className="text-xs">Valor (R$) *</Label><Input type="number" className="mt-1 rounded-xl" value={payableForm.amount} onChange={e => setPayableForm(f => ({ ...f, amount: e.target.value }))} placeholder="0,00" /></div>
            <div><Label className="text-xs">Vencimento</Label><Input type="date" className="mt-1 rounded-xl" value={payableForm.dueDate} onChange={e => setPayableForm(f => ({ ...f, dueDate: e.target.value }))} /></div>
          </div>
          <DialogFooter className="mt-2">
            <Button variant="outline" onClick={closeModal} className="rounded-xl">Cancelar</Button>
            <Button onClick={addPayable} className="rounded-xl bg-[#ef4444] hover:bg-red-600 text-white">{modalData ? "Atualizar Despesa" : "Registrar Despesa"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Conta a Receber */}
      <Dialog open={modal === "receivable"} onOpenChange={open => !open && closeModal()}>
        <DialogContent className="rounded-[20px] max-w-md">
          <DialogHeader><DialogTitle>{modalData ? "Editar Conta a Receber" : "Nova Conta a Receber"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label className="text-xs">Descrição *</Label><Input className="mt-1 rounded-xl" value={receivableForm.description} onChange={e => setReceivableForm(f => ({ ...f, description: e.target.value }))} placeholder="Ex: Fiado, Serviço..." /></div>
            <div><Label className="text-xs">Cliente</Label>
              <Select value={receivableForm.customerId} onValueChange={v => setReceivableForm(f => ({ ...f, customerId: v }))}>
                <SelectTrigger className="mt-1 rounded-xl"><SelectValue placeholder="Selecionar cliente" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">— Nenhum —</SelectItem>
                  {db.customers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div><Label className="text-xs">Valor (R$) *</Label><Input type="number" className="mt-1 rounded-xl" value={receivableForm.amount} onChange={e => setReceivableForm(f => ({ ...f, amount: e.target.value }))} placeholder="0,00" /></div>
            <div><Label className="text-xs">Vencimento</Label><Input type="date" className="mt-1 rounded-xl" value={receivableForm.dueDate} onChange={e => setReceivableForm(f => ({ ...f, dueDate: e.target.value }))} /></div>
          </div>
          <DialogFooter className="mt-2">
            <Button variant="outline" onClick={closeModal} className="rounded-xl">Cancelar</Button>
            <Button onClick={addReceivable} className="rounded-xl bg-[#10b981] hover:bg-emerald-600 text-white">{modalData ? "Atualizar Receita" : "Registrar Receita"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Compra */}
      <Dialog open={modal === "purchase"} onOpenChange={open => !open && closeModal()}>
        <DialogContent className="rounded-[20px] max-w-md">
          <DialogHeader><DialogTitle>Registrar Compra / Entrada de Estoque</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label className="text-xs">Produto *</Label>
              <Select value={purchaseForm.productId} onValueChange={v => { const p = db.products.find(x => x.id === v); setPurchaseForm(f => ({ ...f, productId: v, unitCost: p ? String(p.cost) : f.unitCost })); }}>
                <SelectTrigger className="mt-1 rounded-xl"><SelectValue placeholder="Selecionar produto" /></SelectTrigger>
                <SelectContent>{db.products.map(p => <SelectItem key={p.id} value={p.id}>{p.name} (SKU: {p.sku})</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label className="text-xs">Fornecedor</Label>
              <Select value={purchaseForm.supplierId} onValueChange={v => setPurchaseForm(f => ({ ...f, supplierId: v }))}>
                <SelectTrigger className="mt-1 rounded-xl"><SelectValue placeholder="Selecionar fornecedor" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">— Nenhum —</SelectItem>
                  {db.suppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Quantidade *</Label><Input type="number" className="mt-1 rounded-xl" value={purchaseForm.qty} onChange={e => setPurchaseForm(f => ({ ...f, qty: e.target.value }))} placeholder="0" /></div>
              <div><Label className="text-xs">Custo/un (R$) *</Label><Input type="number" className="mt-1 rounded-xl" value={purchaseForm.unitCost} onChange={e => setPurchaseForm(f => ({ ...f, unitCost: e.target.value }))} placeholder="0,00" /></div>
            </div>
            {purchaseForm.qty && purchaseForm.unitCost && (
              <div className="bg-[#f5f7fb] rounded-xl p-3 flex justify-between text-sm">
                <span className="text-[#9AA8BA]">Total da compra</span>
                <span className="font-bold text-[#1B2A41]">{brl(Number(purchaseForm.qty) * Number(purchaseForm.unitCost))}</span>
              </div>
            )}
            <div><Label className="text-xs">Observação</Label><Input className="mt-1 rounded-xl" value={purchaseForm.note} onChange={e => setPurchaseForm(f => ({ ...f, note: e.target.value }))} placeholder="Opcional" /></div>
          </div>
          <DialogFooter className="mt-2">
            <Button variant="outline" onClick={closeModal} className="rounded-xl">Cancelar</Button>
            <Button onClick={addPurchase} className="rounded-xl bg-[#2453ff] hover:bg-[#1f46d6] text-white">Registrar Compra</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Devolução */}
      <Dialog open={modal === "return"} onOpenChange={open => !open && closeModal()}>
        <DialogContent className="rounded-[20px] max-w-md">
          <DialogHeader><DialogTitle>Registrar Devolução</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label className="text-xs">Venda *</Label>
              <Select value={returnForm.saleId} onValueChange={v => setReturnForm(f => ({ ...f, saleId: v, productId: "" }))}>
                <SelectTrigger className="mt-1 rounded-xl"><SelectValue placeholder="Selecionar venda" /></SelectTrigger>
                <SelectContent>{db.sales.map(s => <SelectItem key={s.id} value={s.id}>#{s.number} — {customerName(s.customerId)} — {brl(s.total)}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label className="text-xs">Produto *</Label>
              <Select value={returnForm.productId} onValueChange={v => setReturnForm(f => ({ ...f, productId: v }))}>
                <SelectTrigger className="mt-1 rounded-xl"><SelectValue placeholder="Selecionar produto" /></SelectTrigger>
                <SelectContent>
                  {(returnForm.saleId ? db.sales.find(s => s.id === returnForm.saleId)?.items || [] : []).map(i => (
                    <SelectItem key={i.productId} value={i.productId}>{i.name} ({i.qty} un)</SelectItem>
                  ))}
                  {!returnForm.saleId && db.products.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div><Label className="text-xs">Quantidade *</Label><Input type="number" className="mt-1 rounded-xl" value={returnForm.qty} onChange={e => setReturnForm(f => ({ ...f, qty: e.target.value }))} placeholder="0" /></div>
            <div><Label className="text-xs">Motivo</Label><Textarea className="mt-1 rounded-xl" value={returnForm.reason} onChange={e => setReturnForm(f => ({ ...f, reason: e.target.value }))} placeholder="Descreva o motivo da devolução..." rows={2} /></div>
          </div>
          <DialogFooter className="mt-2">
            <Button variant="outline" onClick={closeModal} className="rounded-xl">Cancelar</Button>
            <Button onClick={addReturn} className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white">Registrar Devolução</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detalhe de Venda */}
      <Dialog open={modal === "saleDetail"} onOpenChange={open => !open && closeModal()}>
        <DialogContent className="rounded-[20px] max-w-md">
          <DialogHeader><DialogTitle>Venda #{modalData?.number}</DialogTitle></DialogHeader>
          {modalData && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-xs text-[#9AA8BA]">Data</p><p className="font-semibold">{fmtDate(modalData.date)}</p></div>
                <div><p className="text-xs text-[#9AA8BA]">Pagamento</p><p className="font-semibold">{modalData.paymentMethod}</p></div>
                <div className="col-span-2"><p className="text-xs text-[#9AA8BA]">Cliente</p><p className="font-semibold">{customerName(modalData.customerId)}</p></div>
              </div>
              <div className="border-t border-[#f0f4f9] pt-3">
                <p className="text-xs text-[#9AA8BA] mb-2 uppercase tracking-wide font-semibold">Itens</p>
                <div className="space-y-2">
                  {(modalData.items || []).map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-[#22324A]">{item.name} × {item.qty}</span>
                      <span className="font-semibold">{brl(item.price * item.qty)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t border-[#f0f4f9] pt-3 flex items-center justify-between">
                <span className="text-sm text-[#9AA8BA]">Total</span>
                <span className="text-xl font-extrabold text-[#2453ff]">{brl(modalData.total)}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={closeModal} className="rounded-xl">Fechar</Button>
            <Button onClick={() => { setReturnForm({ ...emptyReturn, saleId: modalData?.id || "" }); closeModal(); openModal("return"); }} className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white">
              <Undo2 className="w-4 h-4 mr-1.5" />Devolver Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
