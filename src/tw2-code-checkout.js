// 第 17 部：結帳（購物車 → 填寫資料 → 訂單確認）。教學程式碼不能出現反引號與錢字號。
import { swap } from './tw2-code.js';
import { TYPES_DETAIL, API_DETAIL, APP_DETAIL } from './tw2-code-detail.js';
import { NAV_R } from './tw2-code.js';

// 型別：訂單
export const TYPES_ORDER = TYPES_DETAIL + `
export type OrderUser = {
  name: string
  email: string
  tel: string
  address: string
}

export type Order = {
  id: string
  create_at: number
  is_paid: boolean
  message: string
  total: number
  user: OrderUser
  products: Record<string, CartItem>
}

export type OrderResponse = {
  success: boolean
  order: Order
}

export type CreateOrderResponse = {
  success: boolean
  orderId: string
}
`;

// api：改數量、移除、建立訂單、讀訂單、付款
let api = swap(
  API_DETAIL,
  "import type { Cart, CartResponse, Product, ProductResponse, ProductsResponse } from './types'",
  "import type {\n  Cart,\n  CartResponse,\n  CreateOrderResponse,\n  Order,\n  OrderResponse,\n  OrderUser,\n  Product,\n  ProductResponse,\n  ProductsResponse,\n} from './types'",
);
api = api.replace(/\n*$/, '\n') + `
export async function updateCartItem(id: string, productId: string, qty: number) {
  await api.put('/cart/' + id, { data: { product_id: productId, qty } })
}

export async function removeCartItem(id: string) {
  await api.delete('/cart/' + id)
}

export async function createOrder(user: OrderUser, message: string): Promise<string> {
  const res = await api.post<CreateOrderResponse>('/order', { data: { user, message } })
  return res.data.orderId
}

export async function getOrder(id: string): Promise<Order> {
  const res = await api.get<OrderResponse>('/order/' + id)
  return res.data.order
}

export async function payOrder(id: string) {
  await api.post('/pay/' + id)
}
`;
export const API_ORDER = api;

// 購物車的共享空間：整份 cart 都放進來，不只數量
export const CART_CONTEXT_FULL = `import { createContext } from 'react'
import type { Cart } from '../types'

export type CartContextValue = {
  cart: Cart | null
  count: number
  adding: boolean
  add: (productId: string, qty?: number) => Promise<void>
  updateQty: (itemId: string, productId: string, qty: number) => Promise<void>
  remove: (itemId: string) => Promise<void>
  refresh: () => Promise<void>
}

export const CartContext = createContext<CartContextValue | null>(null)
`;

export const CART_PROVIDER_FULL = `import { useEffect, useState, type ReactNode } from 'react'
import { addToCart, getCart, removeCartItem, updateCartItem } from '../api'
import type { Cart } from '../types'
import { CartContext } from './CartContext'

const emptyCart: Cart = { carts: [], total: 0, final_total: 0 }

const countItems = (cart: Cart | null) => (cart ? cart.carts.reduce((sum, item) => sum + item.qty, 0) : 0)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    getCart()
      .then(setCart)
      .catch(() => setCart(emptyCart))
  }, [])

  const refresh = async () => {
    setCart(await getCart())
  }

  const add = async (productId: string, qty = 1) => {
    setAdding(true)
    try {
      await addToCart(productId, qty)
      await refresh()
    } catch {
      window.alert('加入購物車失敗，請稍後再試')
    } finally {
      setAdding(false)
    }
  }

  const updateQty = async (itemId: string, productId: string, qty: number) => {
    await updateCartItem(itemId, productId, qty)
    await refresh()
  }

  const remove = async (itemId: string) => {
    await removeCartItem(itemId)
    await refresh()
  }

  return (
    <CartContext value={{ cart, count: countItems(cart), adding, add, updateQty, remove, refresh }}>
      {children}
    </CartContext>
  )
}
`;

export const CHECKOUT_DATA = `export const SHIPPING_FEE = 60

export const deliveryOptions = ['蝦皮取貨', '7-11 取貨', '宅配到府']

export const paymentOptions = ['信用卡', 'ATM 轉帳', '貨到付款']

export const formatPrice = (price: number) => 'NT$ ' + price.toLocaleString()
`;

export const STEPS = `type CheckoutStepsProps = {
  current: 1 | 2 | 3
}

const steps = ['查看購物車', '填寫資料', '訂單確認']

function CheckoutSteps({ current }: CheckoutStepsProps) {
  return (
    <ol className="flex border-b-2 border-n-40">
      {steps.map((label, index) => {
        const number = index + 1
        const active = number === current

        return (
          <li
            key={label}
            aria-current={active ? 'step' : undefined}
            className={[
              '-mb-0.5 flex flex-1 flex-col items-center gap-2 border-b-2 pt-4 pb-4.5',
              active ? 'border-primary-dark text-primary-dark' : 'border-transparent text-n-40',
            ].join(' ')}
          >
            <span
              className={[
                'grid size-6 place-items-center rounded-full t-s text-white',
                number <= current ? 'bg-primary-dark' : 'bg-n-40',
              ].join(' ')}
            >
              {number}
            </span>
            <span className="h5">{label}</span>
          </li>
        )
      })}
    </ol>
  )
}

export default CheckoutSteps
`;

export const SUMMARY = `import { SHIPPING_FEE, formatPrice } from '../data/checkout'

type OrderSummaryProps = {
  total: number
}

function OrderSummary({ total }: OrderSummaryProps) {
  return (
    <dl className="space-y-4 px-6 pt-7.5 pb-6 t-m">
      <div className="flex justify-between">
        <dt className="text-n-60">總金額</dt>
        <dd>{formatPrice(total)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-n-60">運費</dt>
        <dd>{formatPrice(SHIPPING_FEE)}</dd>
      </div>
      <div className="flex items-center justify-between border-t-2 border-n-20 pt-6">
        <dt className="text-n-60">應付金額</dt>
        <dd className="h4 text-primary-dark">{formatPrice(total + SHIPPING_FEE)}</dd>
      </div>
    </dl>
  )
}

export default OrderSummary
`;

export const SECTION_TITLE = `import type { ReactNode } from 'react'

type SectionTitleProps = {
  children: ReactNode
}

function SectionTitle({ children }: SectionTitleProps) {
  return <h2 className="h2 bg-primary-100/15 px-4 py-2 lg:text-[24px]">{children}</h2>
}

export default SectionTitle
`;

export const CART_PAGE = `import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import Button from '../components/Button'
import CheckoutSteps from '../components/CheckoutSteps'
import OrderSummary from '../components/OrderSummary'
import QuantityInput from '../components/QuantityInput'
import SectionTitle from '../components/SectionTitle'
import { deliveryOptions, formatPrice, paymentOptions } from '../data/checkout'
import { useCart } from '../hooks/useCart'

const columns = 'lg:grid-cols-[416px_415px_242px_1fr]'

function CartPage() {
  const { cart, updateQty, remove } = useCart()
  const navigate = useNavigate()
  const [delivery, setDelivery] = useState(deliveryOptions[0])
  const [payment, setPayment] = useState('')
  const [showError, setShowError] = useState(false)

  if (!cart) return <p className="py-40 text-center t-m text-n-60">購物車讀取中…</p>

  const goNext = () => {
    if (!payment) {
      setShowError(true)
      return
    }
    navigate('/checkout', { state: { delivery, payment } })
  }

  return (
    <div className="mx-auto max-w-332 px-4 pt-8 pb-18 lg:pt-18">
      <CheckoutSteps current={1} />

      <div className="mt-8 lg:mt-14">
        <SectionTitle>購物車清單</SectionTitle>

        {cart.carts.length === 0 ? (
          <div className="py-20 text-center">
            <p className="mb-8 t-m text-n-60">購物車是空的，去逛逛吧！</p>
            <Link to="/products" className="inline-block bg-primary-dark px-8 py-4 t-m text-white hover:bg-primary-100">
              看看商品
            </Link>
          </div>
        ) : (
          <div>
            <div className={['hidden border-b-2 border-n-40 px-6 py-6 t-m text-n-40 lg:grid', columns].join(' ')}>
              <span>商品資訊</span>
              <span>單價</span>
              <span>數量</span>
              <span className="pl-8 text-center">小計</span>
            </div>

            {cart.carts.map((item) => (
              <div
                key={item.id}
                className={['grid gap-4 border-b-2 border-n-40 px-0 py-6 lg:items-center lg:gap-0 lg:px-6 lg:py-5.75', columns].join(' ')}
              >
                <div className="flex gap-4">
                  <img src={item.product.imageUrl} alt={item.product.title} className="size-25 object-cover" />
                  <div>
                    <p className="t-r text-n-60">{item.product.description}</p>
                    <h3 className="h5 mt-1">{item.product.title}</h3>
                    <button
                      onClick={() => remove(item.id)}
                      className="mt-3 cursor-pointer t-r text-n-60 underline hover:text-primary-100"
                    >
                      移除
                    </button>
                  </div>
                </div>

                <p className="hidden t-m lg:block">{formatPrice(item.product.price)}</p>

                <QuantityInput value={item.qty} onChange={(qty) => updateQty(item.id, item.product_id, qty)} />

                <p className="flex justify-between t-m lg:block lg:pl-8 lg:text-center">
                  <span className="lg:hidden">總計</span>
                  <span className="h6 lg:font-normal">{formatPrice(item.final_total)}</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {cart.carts.length > 0 && (
        <>
          <div className="mt-14 grid gap-8 lg:grid-cols-2 lg:gap-6">
            <div>
              <SectionTitle>選擇送貨及付款方式</SectionTitle>
              <div className="space-y-8 pt-6 lg:pt-8">
                <label className="block">
                  <span className="block h7">送貨方式</span>
                  <select
                    value={delivery}
                    onChange={(e) => setDelivery(e.target.value)}
                    className="mt-2 block h-12.5 w-full border-b border-n-40 bg-transparent px-4 t-m lg:border"
                  >
                    {deliveryOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="block h7">付款方式</span>
                  <select
                    value={payment}
                    onChange={(e) => setPayment(e.target.value)}
                    className={[
                      'mt-2 block h-12.5 w-full border-b bg-transparent px-4 t-m lg:border',
                      showError && !payment ? 'border-red-600' : 'border-n-40',
                      payment ? '' : 'text-n-40',
                    ].join(' ')}
                  >
                    <option value="">請選擇⋯⋯</option>
                    {paymentOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                  {showError && !payment && <span className="mt-2 block t-r text-red-600">請選擇付款方式</span>}
                </label>
              </div>
            </div>

            <div>
              <SectionTitle>訂單資訊</SectionTitle>
              <OrderSummary total={cart.final_total} />
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-6 lg:mt-12">
            <Button variant="unfill" disabled className="bg-n-20 text-n-40 lg:px-4">
              ◀ 回上一步
            </Button>
            <Button onClick={goNext} className="lg:px-4">
              下一步：填寫資料 ▶
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

export default CartPage
`;

export const FORM_FIELD = `type FormFieldProps = {
  label: string
  name: string
  value: string
  error?: string
  type?: string
  placeholder?: string
  onChange: (name: string, value: string) => void
}

function FormField({ label, name, value, error, type = 'text', placeholder, onChange }: FormFieldProps) {
  return (
    <label className="block">
      <span className="block h7">{label}</span>
      <input
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(name, e.target.value)}
        className={[
          'mt-3 block w-full border px-4 py-3 t-m outline-none placeholder:text-n-40 focus:border-primary-100',
          error ? 'border-red-600' : 'border-n-40',
        ].join(' ')}
      />
      {error && <span className="mt-2 block t-r text-red-600">{error}</span>}
    </label>
  )
}

export default FormField
`;

export const CHECKOUT_PAGE = `import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { createOrder } from '../api'
import Button from '../components/Button'
import CheckoutSteps from '../components/CheckoutSteps'
import FormField from '../components/FormField'
import OrderSummary from '../components/OrderSummary'
import SectionTitle from '../components/SectionTitle'
import { useCart } from '../hooks/useCart'

type Values = {
  name: string
  email: string
  tel: string
  address: string
  message: string
}

type Errors = Partial<Record<keyof Values, string>>

const emptyValues: Values = { name: '', email: '', tel: '', address: '', message: '' }

const validate = (values: Values): Errors => {
  const errors: Errors = {}
  if (!values.name.trim()) errors.name = '請填寫姓名'
  if (!values.email.includes('@') || !values.email.includes('.')) errors.email = '請填寫正確的 Email'
  if (values.tel.length !== 10 || !values.tel.startsWith('09') || Number.isNaN(Number(values.tel))) {
    errors.tel = '請填寫 10 碼手機號碼（09 開頭）'
  }
  if (!values.address.trim()) errors.address = '請填寫收件地址'
  return errors
}

function CheckoutPage() {
  const { cart, refresh } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const choice = location.state as { delivery?: string; payment?: string } | null

  const [values, setValues] = useState<Values>(emptyValues)
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)
  const [failed, setFailed] = useState('')

  if (!cart) return <p className="py-40 text-center t-m text-n-60">讀取中…</p>
  if (cart.carts.length === 0) return <p className="py-40 text-center t-m text-n-60">購物車是空的</p>

  const change = (name: string, value: string) => {
    setValues((previous) => ({ ...previous, [name]: value }))
  }

  const submit = async () => {
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setSubmitting(true)
    setFailed('')
    try {
      const note = '送貨：' + (choice?.delivery ?? '未選') + '；付款：' + (choice?.payment ?? '未選') + '。' + values.message
      const orderId = await createOrder(
        { name: values.name, email: values.email, tel: values.tel, address: values.address },
        note,
      )
      await refresh()
      navigate('/order/' + orderId)
    } catch {
      setFailed('送出訂單失敗，請稍後再試')
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-332 px-4 pt-8 pb-18 lg:pt-18">
      <CheckoutSteps current={2} />

      <div className="mt-8 grid gap-8 lg:mt-14 lg:grid-cols-2 lg:gap-6">
        <div>
          <SectionTitle>收件資料</SectionTitle>
          <div className="space-y-8 pt-6 lg:pt-8">
            <FormField label="姓名" name="name" value={values.name} error={errors.name} onChange={change} />
            <FormField label="Email" name="email" type="email" value={values.email} error={errors.email} onChange={change} />
            <FormField label="手機" name="tel" type="tel" placeholder="0912345678" value={values.tel} error={errors.tel} onChange={change} />
            <FormField label="收件地址" name="address" value={values.address} error={errors.address} onChange={change} />
            <FormField label="給我們的話（選填）" name="message" value={values.message} onChange={change} />
          </div>
        </div>

        <div>
          <SectionTitle>訂單資訊</SectionTitle>
          <OrderSummary total={cart.final_total} />
        </div>
      </div>

      {failed && <p className="mt-6 text-right t-m text-red-600">{failed}</p>}

      <div className="mt-8 flex justify-end gap-6 lg:mt-12">
        <Button variant="unfill" className="bg-n-20 text-n-60 lg:px-4" onClick={() => navigate('/cart')}>
          ◀ 回上一步
        </Button>
        <Button disabled={submitting} onClick={submit} className="lg:px-4">
          {submitting ? '送出中…' : '送出訂單 ▶'}
        </Button>
      </div>
    </div>
  )
}

export default CheckoutPage
`;

export const USE_ORDER = `import { useEffect, useState } from 'react'
import { getOrder } from '../api'
import type { Order } from '../types'

type Result = {
  id: string
  order?: Order
  error?: string
}

export default function useOrder(id: string | undefined) {
  const [result, setResult] = useState<Result | null>(null)

  useEffect(() => {
    if (!id) return
    getOrder(id)
      .then((order) => setResult({ id, order }))
      .catch(() => setResult({ id, error: '找不到這筆訂單' }))
  }, [id])

  const current = result?.id === id ? result : null

  return {
    order: current?.order ?? null,
    loading: Boolean(id) && !current,
    error: current?.error ?? '',
  }
}
`;

export const ORDER_PAGE = `import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { payOrder } from '../api'
import Button from '../components/Button'
import CheckoutSteps from '../components/CheckoutSteps'
import SectionTitle from '../components/SectionTitle'
import { SHIPPING_FEE, formatPrice } from '../data/checkout'
import useOrder from '../hooks/useOrder'

function OrderPage() {
  const { id } = useParams()
  const { order, loading, error } = useOrder(id)
  const [paid, setPaid] = useState(false)
  const [paying, setPaying] = useState(false)

  if (loading) return <p className="py-40 text-center t-m text-n-60">訂單讀取中…</p>
  if (error || !order) return <p className="py-40 text-center t-m text-n-60">{error || '找不到這筆訂單'}</p>

  const isPaid = paid || order.is_paid
  const items = Object.values(order.products)

  const pay = async () => {
    setPaying(true)
    try {
      await payOrder(order.id)
      setPaid(true)
    } catch {
      window.alert('付款失敗，請稍後再試')
    } finally {
      setPaying(false)
    }
  }

  return (
    <div className="mx-auto max-w-332 px-4 pt-8 pb-18 lg:pt-18">
      <CheckoutSteps current={3} />

      <div className="mt-8 lg:mt-14">
        <SectionTitle>訂單已成立，謝謝你！</SectionTitle>

        <dl className="grid gap-4 px-6 py-6 t-m lg:grid-cols-2">
          <div>
            <dt className="text-n-60">訂單編號</dt>
            <dd className="break-all">{order.id}</dd>
          </div>
          <div>
            <dt className="text-n-60">付款狀態</dt>
            <dd className={isPaid ? 'text-primary-dark' : 'text-red-600'}>{isPaid ? '已付款' : '尚未付款'}</dd>
          </div>
          <div>
            <dt className="text-n-60">收件人</dt>
            <dd>{order.user.name}（{order.user.tel}）</dd>
          </div>
          <div>
            <dt className="text-n-60">收件地址</dt>
            <dd>{order.user.address}</dd>
          </div>
        </dl>

        <ul className="border-t-2 border-n-40">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-4 border-b-2 border-n-40 px-6 py-6">
              <img src={item.product.imageUrl} alt="" className="size-20 object-cover" />
              <div className="flex-1">
                <p className="h5">{item.product.title}</p>
                <p className="t-r text-n-60">
                  {formatPrice(item.product.price)} × {item.qty}
                </p>
              </div>
              <p className="t-m">{formatPrice(item.final_total)}</p>
            </li>
          ))}
        </ul>

        <p className="px-6 py-6 text-right t-m">
          含運費 {formatPrice(SHIPPING_FEE)}，應付 <b className="h4 text-primary-dark">{formatPrice(order.total + SHIPPING_FEE)}</b>
        </p>
      </div>

      <div className="mt-4 flex justify-end gap-6">
        <Link to="/" className="inline-flex items-center bg-n-20 px-8 py-4 t-m text-n-80 hover:bg-primary-80">
          回首頁
        </Link>
        {!isPaid && (
          <Button disabled={paying} onClick={pay}>
            {paying ? '付款中…' : '前往付款（模擬）'}
          </Button>
        )}
      </div>
    </div>
  )
}

export default OrderPage
`;

// App：新增三條路由
let app = APP_DETAIL;
app = swap(app, "import HomePage from './pages/HomePage'", "import CartPage from './pages/CartPage'\nimport CheckoutPage from './pages/CheckoutPage'\nimport HomePage from './pages/HomePage'\nimport OrderPage from './pages/OrderPage'");
app = swap(app, '          <Route path="products/:id" element={<ProductDetailPage />} />', '          <Route path="products/:id" element={<ProductDetailPage />} />\n          <Route path="cart" element={<CartPage />} />\n          <Route path="checkout" element={<CheckoutPage />} />\n          <Route path="order/:id" element={<OrderPage />} />');
export const APP_CHECKOUT = app;

// Navbar：購物車圖示與手機選單的購物車連結改成連到 /cart
let nav = NAV_R;
nav = swap(nav, '<a href="#" aria-label="購物車" className="flex items-center gap-1">', '<Link to="/cart" aria-label="購物車" className="flex items-center gap-1">');
nav = swap(nav, "{count > 0 && <span className=\"t-r text-primary-dark\">{count}</span>}\n          </a>", "{count > 0 && <span className=\"t-r text-primary-dark\">{count}</span>}\n          </Link>");
nav = swap(
  nav,
  '            <a href="#" className="block border-b border-n-20 py-4 text-center t-l">\n              購物車{count > 0 && \'（\' + count + \'）\'}\n            </a>',
  '            <Link\n              to="/cart"\n              onClick={() => setMobileOpen(false)}\n              className="block border-b border-n-20 py-4 text-center t-l"\n            >\n              購物車{count > 0 && \'（\' + count + \'）\'}\n            </Link>',
);
export const NAV_CART = nav;
