'use client';

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Order, orderActions } from '@/store/redux/order-slice';
import { OrderStatus } from '@/lib/server/order/enum';
import { RootState } from '@/store';
import { menuActions } from '@/store/redux/menu-slice';
import { OrderType } from '@/utils/enum';
import { useHttp } from '@/hooks/useHttp';
import { POSItem } from '@/types';

interface CartItem {
  item: POSItem;
  quantity: number;
}

export function usePOSState() {
  const dispatch = useDispatch();
  
  // HTTP hook for API requests
  const { isLoading: isCreatingOrder, sendHttpRequest: createOrderRequest, error: createOrderError } = useHttp();
  
  // Get menu items from Redux state
  const menu = useSelector((state: RootState) => state.menu);
  const { menus } = menu;
  
  // Convert menu items to POSItem format
  const items: POSItem[] = menus?.map((menuItem: any) => ({
    item_id: menuItem._id || menuItem.id,
    outlet_id: 'outlet_001', // Default outlet
    name: menuItem.itemName,
    description: menuItem.ingredients || '',
    category: menuItem.category,
    price: menuItem.price,
    available: menuItem.status === 'available' || menuItem.status === 'Available',
    prepTime: menuItem.prepTime, // Add prep time
    modifiers: [],
    ingredients: menuItem.ingredients ? menuItem.ingredients.split(',').map((ing: string) => ({
      ingredient_id: `ing_${Math.random().toString(36).substr(2, 9)}`,
      name: ing.trim(),
      quantity: 1,
      unit: 'piece',
      cost: 0
    })) : []
  })) || [];

  // Get orders from Redux state
  const orderState = useSelector((state: RootState) => state.order);
  const { orders } = orderState;
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [tableNumber, setTableNumber] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [showItemDetailsModal, setShowItemDetailsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<POSItem | null>(null);
  const [customerType, setCustomerType] = useState<OrderType>(OrderType.WALK_IN);

  // New Order Form State
  const [newOrderForm, setNewOrderForm] = useState({
    table_number: '',
    room_number: '',
    customer_name: '',
    customer_phone: '',
    order_type: 'dine_in',
    payment_method: 'cash',
    notes: ''
  });

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (item: POSItem) => {
    setCart(prev => {
      const existingItem = prev.find(cartItem => cartItem.item.item_id === item.item_id);
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.item.item_id === item.item_id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prev, { item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(cartItem => cartItem.item.item_id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCart(prev => prev.map(cartItem =>
        cartItem.item.item_id === itemId
          ? { ...cartItem, quantity }
          : cartItem
      ));
    }
  };

  const getTotal = () => {
    return cart.reduce((sum, cartItem) => sum + (cartItem.item.price * cartItem.quantity), 0);
  };

  const createOrder = () => {
    if (cart.length === 0) return;

    // Prepare order data for API request
    const orderData = {
      roomNumber: roomNumber || undefined,
      tableNumber: tableNumber || undefined,
      orderType: customerType,
      items: cart.map(cartItem => ({
        menuId: cartItem.item.item_id,
        quantity: cartItem.quantity
      }))
    };

    const onSuccessHandler = (res: any) => {
      console.log('Order created successfully:', res.data);

      const order = res?.data?.data?.order;

      dispatch(orderActions.addOrder(order));
      
      // Orders are now managed by Redux, no need to update local state
      setCart([]);
      setTableNumber('');
      setRoomNumber('');
    };

    createOrderRequest({
      successRes: onSuccessHandler,
      requestConfig: {
        url: '/hotel/create-order',
        method: 'POST',
        body: orderData,
        successMessage: 'Order created successfully'
      }
    });
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    // This would typically update via API call
    console.log('Updating order status:', orderId, status);
  };

  const handleNewOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      alert('Please add items to cart before creating an order');
      return;
    }
    
    // Create the order using the existing createOrder function
    createOrder();
    
    console.log('Creating new order with details:', newOrderForm);
    setShowNewOrderModal(false);
    
    // Reset form
    setNewOrderForm({
      table_number: '',
      room_number: '',
      customer_name: '',
      customer_phone: '',
      order_type: 'dine_in',
      payment_method: 'cash',
      notes: ''
    });
  };

  const posStats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === OrderStatus.PENDING).length,
    preparingOrders: 0, // This status doesn't exist in OrderStatus enum
    readyOrders: orders.filter(o => o.status === OrderStatus.READY).length,
    totalRevenue: orders.reduce((sum, order) => 
      sum + order.items.reduce((itemSum, item) => 
        itemSum + (item.priceWhenOrdered * item.quantity), 0), 0)
  };

  // Function to refresh menu items (useful when new items are added)
  const refreshMenuItems = () => {
    // This would typically fetch from API, but for now we'll just log
    console.log('Menu items refreshed from Redux state');
  };

  // Function to handle viewing item details
  const handleViewItemDetails = (item: POSItem) => {
    setSelectedItem(item);
    setShowItemDetailsModal(true);
  };

  return {
    // State
    items,
    orders,
    cart,
    searchTerm,
    categoryFilter,
    selectedOrder,
    tableNumber,
    roomNumber,
    showNewOrderModal,
    newOrderForm,
    filteredItems,
    posStats,
    showItemDetailsModal,
    selectedItem,
    customerType,
    
    // Setters
    setSearchTerm,
    setCategoryFilter,
    setSelectedOrder,
    setTableNumber,
    setRoomNumber,
    setShowNewOrderModal,
    setNewOrderForm,
    setShowItemDetailsModal,
    setCustomerType,
    setSelectedItem,
    
    // Functions
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotal,
    createOrder,
    updateOrderStatus,
    handleNewOrderSubmit,
    refreshMenuItems,
    handleViewItemDetails,
    
    // HTTP States
    isCreatingOrder,
    createOrderError
  };
}
