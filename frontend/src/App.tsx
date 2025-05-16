import { Button, Layout, Modal } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import { useState } from "react";
import { DataManager } from "./balance-electrico/components/data-manager";
import { RefreshDataButton } from "./balance-electrico/components/refresh-data-button";
import { SyncDataForm } from "./balance-electrico/components/sync-data/sync-data.form";
import { refetchQueries } from "./balance-electrico/queries/refetch-queries";

function App() {
  const [isSyncModalOpen, setIsSyncModalOpen] = useState<boolean>(false);

  return (
    <Layout
      style={{ height: "100dvh", width: "100vw", display: "flex", flex: 1 }}
    >
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            color: "white",

            fontSize: 24,
            fontWeight: "bold",
            marginRight: 16,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          Balance Eléctrico
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <Button size="small" onClick={() => setIsSyncModalOpen(true)}>
            Sincronizar API
          </Button>
          <RefreshDataButton />
        </div>
      </Header>
      <Content style={{ padding: "0 48px", flex: 1, display: "flex" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            margin: 24,
          }}
        >
          <DataManager />
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Alejandro Arraiza - {new Date().getFullYear()}
      </Footer>
      <Modal
        open={isSyncModalOpen}
        footer={null}
        destroyOnHidden
        onCancel={() => setIsSyncModalOpen(false)}
      >
        <SyncDataForm
          onDone={() => {
            setIsSyncModalOpen(false);
            refetchQueries();
          }}
        />
      </Modal>
    </Layout>
  );
}

export default App;
