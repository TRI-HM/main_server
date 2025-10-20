import { Socket, Server } from "socket.io"
import { wrapAsyncSocket } from "../../../middleware/wrapAsyncSocket"
import buttonLogService from "../../modules/buttonLog/buttonLog.service";
import { ButtonLogClientType } from "../../../models/buttonLog/buttonLog.model";

const buttonLogController = wrapAsyncSocket(
  async (socket: Socket, io: Server) => {
    socket.on('clickLog:create', async (data: { button1?: boolean, button2?: boolean, button3?: boolean, button4?: boolean }) => {
      try {
        console.log('🔔 Controller received clickLog:create event with data:', data);

        let newData: ButtonLogClientType = {
          button1: data.button1 || false,
          button2: data.button2 || false,
          button3: data.button3 || false,
          button4: data.button4 || false,
        };

        const result = await buttonLogService.logButtonClick(newData);
        console.log('🎯 Controller received clickLog:create event with data:', newData);
        io.emit('clickLog:createResponse', {
          success: true,
          message: `Created new button log`,
          data: result,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error handling clickLog:create event:', error);
        socket.emit('clickLog:createResponse', {
          success: false,
          message: `Failed to create button log`,
          error: 'Server error occurred',
          timestamp: new Date().toISOString()
        });
      }
    });

    socket.on('clickLog:all', async ({ page, pageSize }: { page?: number, pageSize?: number }) => {
      try {
        console.log(`🔔 Controller received clickLog:all event page: ${page} pageSize: ${pageSize}`)
        const result = await buttonLogService.all(page, pageSize)
        socket.emit('clickLog:allResponse', {
          success: true,
          message: `Retrieved all button logs with pagination`,
          data: result?.data || [],
          pagination: result?.pagination || null,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error handling clickLog:all event:', error);
        socket.emit('clickLog:allResponse', {
          success: false,
          message: `Failed to retrieve all button logs`,
          error: 'Server error occurred',
          timestamp: new Date().toISOString()
        });
      }
    });
  }
)

export default buttonLogController