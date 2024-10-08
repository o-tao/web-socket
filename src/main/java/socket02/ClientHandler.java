package socket02;

import file.Note;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;

public class ClientHandler implements Runnable{

    private Socket socket;
    private PrintWriter out;
    private StringBuffer history;

    public ClientHandler(Socket socket) {
        this.socket = socket;
        history = Note.in();
    }

    @Override
    public void run() {
        try {
            BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
            PrintWriter out = new PrintWriter(socket.getOutputStream(), true);

            synchronized (socket) {
                MultiClientServer.clientWriters.add(out);
            }

            out.println(history.toString());

            String message;
            while((message = in.readLine()) != null) {
                System.out.println("클라이언트 대화글 : " + message);
                out.println("서버에 전송 받은 글 :" + message);
                Note.out("서버에 전송 받은 글 : " + message);
            }
        } catch (IOException e) {
//			e.printStackTrace();
            System.out.println("클라이언트가 접속을 종료 하였습니다.");
        } finally {
            try {
                synchronized (MultiClientServer.clientWriters) {
                    MultiClientServer.clientWriters.remove(out);
                }
                socket.close();
                System.out.println("클라이언트가 접속을 종료 하였습니다.");
            } catch (IOException e) {
//				e.printStackTrace();
            }
        }
        System.out.println("연결 종료 되었습니다.");
    }
}
