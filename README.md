# Nuber Eats

The Backend of Nuber Eats Clone

- Order Subscription
 > Pending Orders (subscription: newOrder) > (🚀tringger: createOrder(newOrder))  
 "pending orders @Resolver가 'newOrder event'를 listening 해야된다"

 > Order Status (Customer, Delivery, Owner) (s: orderUpdate) (t: editOrder(orderUpdate) )
  "editOrder가 'order status'를 update할 때마다 orderUpdate를 trigger할 거다  


 > Pending Pickup Order (Delivery) (s: orderUpdate) (t: editOrder(orderUpdate) )

- Payments (CRON)