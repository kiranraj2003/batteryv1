import express from "express";
import Battery from "../models/Battery.js";

const router = express.Router();

/* CREATE */
router.post("/", async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Request body is empty" });
    }

    const battery = await Battery.create(req.body);
    res.status(201).json(battery);
  } catch (error) {
    console.error("CREATE BATTERY ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
});

/* SEARCH – SPACE INSENSITIVE */
router.get("/", async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    if (!q) return res.json([]);

    const normalizedQ = q.replace(/\s+/g, "").toUpperCase();

    const batteries = await Battery.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { phone: { $regex: q, $options: "i" } },
        { serial: { $regex: q, $options: "i" } },
        {
          $expr: {
            $regexMatch: {
              input: {
                $toUpper: {
                  $replaceAll: {
                    input: "$vehicleNumber",
                    find: " ",
                    replacement: "",
                  },
                },
              },
              regex: normalizedQ,
            },
          },
        },
      ],
    }).limit(20);

    res.json(batteries);
  } catch (error) {
    console.error("SEARCH BATTERY ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
});

/* UPDATE */
router.put("/:id", async (req, res) => {
  try {
    const updated = await Battery.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Battery not found" });
    }

    res.json(updated);
  } catch (error) {
    console.error("UPDATE BATTERY ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
});

/* DELETE */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Battery.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Battery not found" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("DELETE BATTERY ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
});

export default router;

// import express from "express";
// import Battery from "../models/Battery.js";

// const router = express.Router();

// /* CREATE */
// router.post("/", async (req, res) => {
//   try {
//     const battery = await Battery.create(req.body);
//     res.json(battery);
//   } catch {
//     res.status(500).json({ message: "Create failed" });
//   }
// });

// /* SEARCH – SPACE INSENSITIVE */
// router.get("/", async (req, res) => {
//   try {
//     const q = (req.query.q || "").trim();
//     if (!q) return res.json([]);

//     const normalizedQ = q.replace(/\s+/g, "").toUpperCase();

//     const batteries = await Battery.find({
//       $or: [
//         { name: { $regex: q, $options: "i" } },
//         { phone: { $regex: q, $options: "i" } },
//         { serial: { $regex: q, $options: "i" } },
//         {
//           $expr: {
//             $regexMatch: {
//               input: {
//                 $toUpper: {
//                   $replaceAll: {
//                     input: "$vehicleNumber",
//                     find: " ",
//                     replacement: ""
//                   }
//                 }
//               },
//               regex: normalizedQ
//             }
//           }
//         }
//       ]
//     }).limit(20);

//     res.json(batteries);
//   } catch {
//     res.status(500).json({ message: "Search failed" });
//   }
// });

// /* UPDATE */
// router.put("/:id", async (req, res) => {
//   const updated = await Battery.findByIdAndUpdate(
//     req.params.id,
//     req.body,
//     { new: true }
//   );
//   res.json(updated);
// });

// /* DELETE */
// router.delete("/:id", async (req, res) => {
//   await Battery.findByIdAndDelete(req.params.id);
//   res.json({ message: "Deleted" });
// });

// export default router;
