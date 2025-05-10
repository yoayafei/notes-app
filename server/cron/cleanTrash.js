import cron from "node-cron";
import pool from "../config/db.js";

// 每天凌晨3点执行清理任务
cron.schedule("0 3 * * *", async () => {
  try {
    const [result] = await pool.query(
      "DELETE FROM notes WHERE deleted = 1 AND updated_at < NOW() - INTERVAL 10 DAY"
    );
    console.log(`Cleaned ${result.affectedRows} notes from trash`);
  } catch (error) {
    console.error("Failed to clean trash:", error);
  }
});
