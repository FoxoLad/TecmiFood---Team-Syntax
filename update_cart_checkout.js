const fs = require('fs');
const file = 'src/app/client/(client-tabs)/cart.tsx';
let code = fs.readFileSync(file, 'utf8');

const replacement = `
  const handleCheckout = async () => {
    setShowConfirmModal(false);
    setIsSubmitting(true);
    try {
      await fetchStatus();
      if (!useCafeteriaStatus.getState().isOpen) {
        Alert.alert("Cafetería cerrada", "Solo puedes pedir cuando la cafetería esté abierta.");
        setIsSubmitting(false);
        return;
      }

      await fetchOrders();
      const myOrders = useOrders.getState().orders.filter(o => {
        return o.customerName === clientLabel(useUserStore.getState().clientId);
      });
      
      const activeCount = myOrders.filter(o => o.status !== "Entregado" && o.status !== "Cancelado").length;
      if (activeCount >= 3) {
         Alert.alert("Límite de pedidos", "Solo puedes tener un máximo de 3 pedidos activos al mismo tiempo.");
         setIsSubmitting(false);
         return;
      }
      
      const thirtyMinsAgo = Date.now() - 30 * 60 * 1000;
      const recentOrders = myOrders.filter(o => new Date(o.createdAt).getTime() > thirtyMinsAgo);
      
      // Determine how many orders we are about to create
      const itemsToOrder = checkoutScope === "all" ? items : (checkoutScope === "busters" ? bustersItems : beeSweetItems);
      if (itemsToOrder.length === 0) {
        setIsSubmitting(false);
        return;
      }

      const orderBusters = itemsToOrder.filter(i => i.product.businessId === "BT");
      const orderBeeSweet = itemsToOrder.filter(i => i.product.businessId === "BS");
      
      let numNewOrders = 0;
      if (orderBusters.length > 0) numNewOrders++;
      if (orderBeeSweet.length > 0) numNewOrders++;

      if (recentOrders.length + numNewOrders > 2) {
         Alert.alert("Límite de tiempo", "Has realizado muchos pedidos recientemente. Por favor espera 30 minutos antes de hacer otro pedido.");
         setIsSubmitting(false);
         return;
      }

      const sendOrder = async (orderItems) => {
        if (orderItems.length === 0) return null;
        const total = orderItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        const orderData = {
          customerName: clientLabel(clientId),
          totalAmount: total,
          items: orderItems.map((item) => ({
            productId: item.product.id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            image: item.product.image,
            modifications: item.modifications,
            notes: item.notes,
          })),
        };

        const response = await fetch(endpoints.orders, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        });

        if (response.status === 403) {
          throw new Error("closed");
        }

        if (!response.ok) {
          throw new Error("Error al enviar el pedido");
        }
        
        return await response.json();
      };

      try {
        let lastResult = null;
        if (orderBusters.length > 0) {
          const res = await sendOrder(orderBusters);
          if (res && isRealOrder(res)) {
            rememberOrder(res);
            lastResult = res;
          }
        }
        
        if (orderBeeSweet.length > 0) {
          const res = await sendOrder(orderBeeSweet);
          if (res && isRealOrder(res)) {
            rememberOrder(res);
            lastResult = res;
          }
        }
        
        if (checkoutScope === "all") {
          clearCart();
        } else {
          itemsToOrder.forEach(i => removeItem(i.cartItemId));
        }
        
        fetchOrders();
        
        // If we created two orders, we just go to the regular orders view to see both.
        // If one order, we go to preparing screen.
        if (numNewOrders > 1) {
           router.push("/client/orders");
        } else if (lastResult && isRealOrder(lastResult)) {
          router.push({
            pathname: "/client/preparing",
            params: { id: lastResult._id || String(lastResult.orderNumber) },
          });
        } else {
          router.push("/client/orders");
        }

      } catch (err) {
        if (err.message === "closed") {
           Alert.alert("Cafetería cerrada", "Solo puedes pedir cuando la cafetería esté abierta.");
        } else {
           throw err;
        }
      }
    } catch (error) {
      console.error("Error al enviar orden:", error);
      Alert.alert(
        "Error",
        "Hubo un problema al procesar tu pedido. Intenta nuevamente.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };
`;

code = code.replace(/const handleCheckout = async \(\) => \{[\s\S]*?finally \{\s*setIsSubmitting\(false\);\s*\}\s*\};/, replacement.trim());

fs.writeFileSync(file, code);
console.log('Done replacing handleCheckout');
