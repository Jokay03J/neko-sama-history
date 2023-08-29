import "../../global.css";
import { Separator } from "@/components/ui/separator";
import Sidebar from "./Sidebar";
import { Input } from "@/components/ui/input";
import { useEffect, useId, useState } from "react";
import { Label } from "@/components/ui/label";
import PeerJs, { DataConnection } from "peerjs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import type { Anime } from "@/types/animes";
import Extension from "webextension-polyfill";

enum TypeAction {
  // send type set request for set anime on recipiant
  SET = "set",
  // recipiant has been accepted your SET request
  ACCEPTED = "accepted",
  // During connection there is been error
  ERROR = "error",
}

type DataConnectionType = {
  type: TypeAction;
  animes?: Anime[];
  error?: Error;
};

function App() {
  const syncIdInputSender = useId();
  const recipiantInputId = useId();
  const [peerClient, setPeerClient] = useState<PeerJs | null>(null);
  const [peerConnection, setPeerConnection] = useState<
    DataConnection | null | undefined
  >(null);
  const [recipiantInputValue, setRecipiantInputValue] = useState("NSP-");
  const { toast } = useToast();

  useEffect(() => {
    const client = new PeerJs(`NSP-${Math.floor(Math.random() * 1000)}`);
    setPeerClient(client);

    client.on("connection", (conn) => {
      conn.on("data", async (e) => {
        const data = e as DataConnectionType;
        switch (data.type) {
          case TypeAction.SET:
            if (confirm(`Accept ${conn.peer} data ?`)) {
              if (data.animes) {
                await Extension.storage.local.set({ animes: data.animes });
                conn.send({ type: TypeAction.ACCEPTED });
              }
            }
            conn.close();
            setPeerConnection(null);
            break;

          case TypeAction.ACCEPTED:
            toast({
              title: "Recipiant has been accpeted your request !",
            });
            conn.close();
            setPeerConnection(null);
            break;

          case TypeAction.ERROR:
            toast({
              title: "Error !",
              description: data.error?.message,
              variant: "destructive",
            });
            conn.close();
            setPeerConnection(null);
            break;

          default:
            toast({ variant: "destructive", title: "Unknown data type" });
            conn.close();
            setPeerConnection(null);
            break;
        }
      });

      conn.on("error", (error) => {
        console.error(error);
        toast({
          title: "Error !",
          description: error.message,
          variant: "destructive",
        });
        conn.close();
        setPeerConnection(null);
      });
    });

    return () => {
      if (client) {
        client.destroy();
      }
    };
  }, []);

  async function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const { animes } = await Extension.storage.local.get(["animes"]);
    if (!recipiantInputValue) {
      toast({
        variant: "destructive",
        title:
          "You must provide an recipiant id to connect your other device !",
      });
      return;
    }

    if (!animes) {
      toast({ variant: "destructive", title: "You must have saved animes !" });
      return;
    }

    const conn = peerClient?.connect(recipiantInputValue);
    if (!conn) {
      toast({
        variant: "destructive",
        title: "Unable to connect to recipiant ",
        description: "Ther id is correct ?",
      });
      return;
    }
    setPeerConnection(conn);

    conn.on("open", async () => {
      toast({ title: "Connected to " + conn.peer });

      conn.send({ animes: animes, type: "set" } as DataConnectionType);
    });

    conn.on("data", (e) => {
      const data = e as DataConnectionType;
      switch (data.type) {
        case TypeAction.ERROR:
          toast({
            title: "Error !",
            description: data.error?.message,
            variant: "destructive",
          });
          conn.close();
          setPeerConnection(null);
          break;

        case TypeAction.ACCEPTED:
          toast({ title: "Recipiant has been accepted your data !" });
          conn.close();
          setPeerConnection(null);
          break;

        default:
          toast({
            variant: "destructive",
            title: "Unknown data type",
          });
          conn.close();
          setPeerConnection(null);
          break;
      }
    });
  }

  async function deleteAll() {
    await Extension.storage.local.remove("animes");
    toast({ title: "Your data has been deleted" });
  }

  return (
    <div className="p-2">
      <header>
        <h1 className="text-3xl font-bold">Options</h1>
        <p className="text-sm text-muted-foreground">
          You can configure Neko Sama History here.
        </p>
      </header>
      <Separator className="my-2" />
      <main className="flex flex-col lg:flex-row w-full gap-2">
        <Sidebar
          items={[
            { title: "Synchronization", href: "#sync" },
            { title: "Data", href: "#data" },
          ]}
          className="w-full lg:w-2/12"
        />
        <div className="w-full lg:w-10/12">
          <section id="sync" className="w-full">
            <h2 className="text-2xl">Synchronization</h2>
            <p className="text-sm text-muted-foreground">
              Synchronize devices with peer to peer connection.
            </p>
            <Separator className="my-2" />
            {!peerClient ? (
              <div>loading</div>
            ) : (
              <>
                <form onSubmit={onSubmit}>
                  <Label htmlFor={syncIdInputSender}>Your sender id :</Label>
                  <Input
                    value={peerClient.id}
                    disabled
                    id={syncIdInputSender}
                    className="mb-2"
                  />
                  <Label htmlFor={recipiantInputId}>Recipiant id:</Label>
                  <Input
                    required
                    id={recipiantInputId}
                    value={recipiantInputValue}
                    onChange={(ev) => setRecipiantInputValue(ev.target.value)}
                    placeholder="NSP-****"
                    disabled={peerConnection != null}
                    autoComplete="off"
                  />
                  <Button
                    type="submit"
                    className="my-2"
                    disabled={peerConnection != null}
                  >
                    Connect and request
                  </Button>
                </form>
              </>
            )}
          </section>
          <section id="data" className="w-full">
            <h2 className="text-2xl">Data</h2>
            <p className="text-sm text-muted-foreground">
              Control your saved animes.
            </p>
            <Separator className="my-2" />
            <Button variant={"destructive"} onClick={deleteAll}>
              Delete all
            </Button>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
