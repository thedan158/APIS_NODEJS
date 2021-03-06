import admin from "firebase-admin";
import serviceAccount from "../serviceAccountKey.json" assert { type: "json" };

//*Region connect to database
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.STORAGE_URL,
  });
} else {
  admin.app();
}
const db = admin.firestore();
//*End region
export const OrderController = {
  //*Create new order
  isExistingOder: async (req, res) => {
    try {
      const order = await db.collection("Order").doc(req.body.orderID).get();
      if (order.data()) {
        return res
          .status(200)
          .json({ success: true, message: "Order is existing" });
      }
      return res
        .status(404)
        .json({ success: false, message: "Order is not existing" });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Error when check order" });
    }
  },
  //* Get open order
  getCurrentOrderID: async (req, res) => {
    try {
      const snapshot = await db
        .collection("Order")
        .where("tableID", "==", req.body.tableID)
        .get();
      if (!snapshot.empty) {
        snapshot.forEach((doc) => {
          if (doc.data().isClose == false) {
            const orderID = doc.data().id;
            return res.status(200).json({ success: true, message: orderID });
          }
        });
      } else {
        res.status(200).json({ success: false, message: "No open order" });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error",
      });
    }
  },
  //* End region
  createOrder: async (req, res) => {
    try {
      function randomNumber() {
        return Math.floor(Math.random() * (99999999 - 10000000 + 1)) + 10000000;
      }
      var tempID = randomNumber().toString();
      // var order = await db.collection("Order").doc(tempID.toString()).get();
      // while (order.data()) {
      //   tempID = randomNumber();
      //   console.log(tempID);
      //   order = await db.collection("Order").doc(tempID).get();
      // }
      const order = await db.collection("Order").doc(tempID).get();
      while (order.data()) {
        tempID = randomNumber().toString();
        order = await db.collection("Order").doc(tempID).get();
      }

      const data = {
        id: tempID,
        isClose: false,
        tableID: req.body.tableID,
      };
      // const table = await db.collection("Table").doc(req.params.tableID).get();
      // if (!table.data()) {
      //   res.status(501).json({
      //     success: false,
      //     message: "Invalid Table ID",
      //   });
      // } else {
      await db.collection("Order").doc(tempID).set(data);
      return res.status(200).json({
        success: true,
        message: "Order created",
      });
      // }
    } catch (err) {
      return res.status(500).json({ success: false, message: err });
    }
  },
  //*End region
  //*Region get orderID
  getOrderInfo: async (req, res) => {
    try {
      //  db.collection("posts").onSnapshot((snapshot) => {
      //    const postData = [];
      //    snapshot.forEach((doc) => postData.push({ ...doc.data(), id: doc.id }));
      //    console.log(postData); // <------
      //    setPosts(postData);
      //  });
      console.log("ok0");
      const OrderInfoo = [];
      await db
        .collection("Order")
        .doc(req.params.tableID)
        .collection("OrderInfo")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            console.log(doc.data());
          });
        });
      console.log(OrderInfoo);
      console.log("ok");
      return res.status(200).json({ success: true, message: "Success" });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: "Error when get order" });
    }
  },
  //*End region
  //*Update order
  updateOrder: async (req, res) => {
    let orderDocument = db.collection("Order").doc(req.body.id);
    return orderDocument
      .update({
        isClose: true,
      })
      .then(() => {
        return res
          .status(200)
          .json({ success: true, message: "Order updated" });
      })
      .catch(() => {
        return res
          .status(500)
          .json({ success: false, message: "Error when update order" });
      });
  },
  //*End region
  //*Delete order
  deleteOrder: async (req, res) => {
    try {
      let order = await db.collection("Order").doc(req.params.id).get();
      if (!order.data()) {
        res.status(500).json({ success: false, message: "Invalid order id" });
      } else {
        await db.collection("Order").doc(req.params.id).delete();
        res.status(200).json({ success: true, message: "Order deleted" });
      }
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: "Error when delete order" });
    }
    // let menuDocument = db.collection("Menu").doc(req.params.id);
    // return menuDocument
    //   .delete()
    //   .then(() => {
    //     return res.status(204).json({ success: true, message: "Menu deleted" });
    //   })
    //   .catch((error) => {
    //     return res
    //       .status(500)
    //       .json({ success: false, message: "Error when delete menu" });
    //   });
  },
  //*End region
  //*Get all order of table
  getAllOrderOfRestaurant: async (req, res) => {
    try {
      var orders = [];
      const table = await db
        .collection("Table")
        .where(restaurantID, "==", req.params.restaurantID)
        .get();
      table.forEach((temp) => {
        console.log(temp.id, "=>", temp.data());
        let orderQuery = db
          .collection("Order")
          .where("tableID", "==", temp.id)
          .get();
        orderQuery.then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            orders.push(doc.data());
          });
        });
      });
      res
        .status(200)
        .json({ success: true, message: "Got all bill of a restaurant" });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: "Error when get all bill" });
    }
  },
  //*End region
  //*Get all order
  // getAllOrder: async (req, res) => {
  //   try {
  //     const snapshot = await db.collection("Order").get();
  //     snapshop.forEach((order) => {
  //       console.log(order.id, "=>", order.data());
  //     });
  //     res.status(200).json({ success: true, message: "Got all order" });
  //   } catch (err) {
  //     res
  //       .status(500)
  //       .json({ success: false, message: "Error when get all order" });
  //   }
  // },
  //*End region
};
