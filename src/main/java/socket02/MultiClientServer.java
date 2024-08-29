package socket02;

import java.io.IOException;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.ArrayList;
import java.util.List;

public class MultiClientServer {

    public static final List<PrintWriter> clientWriters = new ArrayList<>();

    public static void main(String[] args) {
        try {
            ServerSocket serverSocket = new ServerSocket(9000);
            System.out.println("소켓 서버 실행 완료!");

            while(true) {
                try {
                    Socket socket = serverSocket.accept();
                    System.out.println("클라이언트 접속 되었습니다.");
                    new Thread(new ClientHandler(socket)).start();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

        } catch (IOException e) {
//			e.printStackTrace();
        }
    }

}
