import { useState, useEffect } from 'react';
import { Product, Customer, Doctor, Sale, PendingApproval, ReturnItem } from '../types';
import { api } from '../services/api';
import {
  initialProducts,
  initialCustomers,
  initialDoctors,
  initialSales,
  initialPendingApprovals,
  initialReturns
} from '../data';

export function useAppStorage(user: any, isAuthenticated: boolean) {
  const initialShopId = user?.shop_id || user?.id || 'default';

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(`rx_products_${initialShopId}`);
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem(`rx_customers_${initialShopId}`);
    return saved ? JSON.parse(saved) : initialCustomers;
  });

  const [doctors, setDoctors] = useState<Doctor[]>(() => {
    const saved = localStorage.getItem(`rx_doctors_${initialShopId}`);
    return saved ? JSON.parse(saved) : initialDoctors;
  });

  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem(`rx_sales_${initialShopId}`);
    return saved ? JSON.parse(saved) : initialSales;
  });

  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>(() => {
    const saved = localStorage.getItem(`rx_approvals_${initialShopId}`);
    return saved ? JSON.parse(saved) : initialPendingApprovals;
  });

  const [returns, setReturns] = useState<ReturnItem[]>(() => {
    const saved = localStorage.getItem(`rx_returns_${initialShopId}`);
    return saved ? JSON.parse(saved) : initialReturns;
  });

  useEffect(() => {
    localStorage.setItem(`rx_products_${initialShopId}`, JSON.stringify(products));
  }, [products, initialShopId]);

  useEffect(() => {
    localStorage.setItem(`rx_customers_${initialShopId}`, JSON.stringify(customers));
  }, [customers, initialShopId]);

  useEffect(() => {
    localStorage.setItem(`rx_doctors_${initialShopId}`, JSON.stringify(doctors));
  }, [doctors, initialShopId]);

  useEffect(() => {
    localStorage.setItem(`rx_sales_${initialShopId}`, JSON.stringify(sales));
  }, [sales, initialShopId]);

  useEffect(() => {
    localStorage.setItem(`rx_approvals_${initialShopId}`, JSON.stringify(pendingApprovals));
  }, [pendingApprovals, initialShopId]);

  useEffect(() => {
    localStorage.setItem(`rx_returns_${initialShopId}`, JSON.stringify(returns));
  }, [returns, initialShopId]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchData = async () => {
      try {
        const [invRes, salesRes, setRes, retRes, doctorsRes] = await Promise.all([
          api.get('/pharmacy/inventory').catch(() => null),
          api.get('/pharmacy/sales').catch(() => null),
          api.get('/pharmacy/settlements').catch(() => null),
          api.get('/pharmacy/returns').catch(() => null),
          api.get('/area-doctors/public').catch(() => null)
        ]);

        if (invRes?.success && invRes.data.length > 0) setProducts(invRes.data);
        if (salesRes?.success && salesRes.data.length > 0) setSales(salesRes.data);
        if (setRes?.success && setRes.data.length > 0) setPendingApprovals(setRes.data);
        if (retRes?.success && retRes.data.length > 0) setReturns(retRes.data);
        if (doctorsRes?.data && doctorsRes.data.length > 0) {
          const mappedDoctors = doctorsRes.data.map((d: any) => ({
            id: String(d.doctor_id || d.id),
            name: d.full_name,
            specialty: 'Area Doctor',
            phone: d.mobile,
            availability: 'Available',
            clinic: d.address || 'Public Clinic'
          }));
          setDoctors(mappedDoctors);
        }
      } catch (err) {
        console.error("Failed to fetch initial backend data", err);
      }
    };
    fetchData();
  }, [isAuthenticated]);

  return {
    products, setProducts,
    customers, setCustomers,
    doctors, setDoctors,
    sales, setSales,
    pendingApprovals, setPendingApprovals,
    returns, setReturns
  };
}
