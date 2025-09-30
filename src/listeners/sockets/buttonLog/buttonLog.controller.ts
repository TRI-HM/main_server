import { Socket, Server } from "socket.io"
import { wrapAsyncSocket } from "../../../middleware/wrapAsyncSocket"
import buttonLogService from "../../modules/buttonLog/buttonLog.service";
import { ButtonLogClientType } from "../../../models/buttonLog/buttonLog.model";

const buttonLogController = wrapAsyncSocket(
  async (socket: Socket, io: Server) => {
    socket.on('clickLog:buttonClick', async (data: { button1?: boolean, button2?: boolean, button3?: boolean, button4?: boolean }) => {
      try {
        console.log('🔔 Controller received clickLog:buttonClick event with data:', data);

        let newData: ButtonLogClientType = {
          button1: data.button1 || false,
          button2: data.button2 || false,
          button3: data.button3 || false,
          button4: data.button4 || false,
        };

        const result = await buttonLogService.logButtonClick(newData);
        console.log('🎯 Controller received clickLog:buttonClick event with data:', newData);
        socket.emit('clickLog:buttonClickResponse', {
          success: true,
          message: `Created new button log`,
          data: result,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error handling clickLog:buttonClick event:', error);
        socket.emit('clickLog:buttonClickResponse', {
          success: false,
          message: `Failed to create button log`,
          error: 'Server error occurred',
          timestamp: new Date().toISOString()
        });
      }
    });

    socket.on('clickLog:all', async () => {
      try {
        console.log('🔔 Controller received clickLog:all event')
        const result = await buttonLogService.all()
        socket.emit('clickLog:allResponse', {
          success: true,
          message: `Retrieved all button logs`,
          data: result,
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