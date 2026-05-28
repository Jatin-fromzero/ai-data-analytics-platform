export class AuditService {
  /**
   * Log critical actions taken by administrators or super-admins.
   */
  static log(actorId: string, action: string, targetId: string, details?: string) {
    const timestamp = new Date().toISOString();
    const logMessage = `[SECURITY AUDIT - ${timestamp}] Actor: ${actorId} | Action: ${action} | Target: ${targetId} | Details: ${details || 'N/A'}`;
    
    // Output directly to standard console which production logging collectors (e.g. CloudWatch, Winston, Grafana Loki) aggregate.
    console.warn(logMessage);
  }
}
