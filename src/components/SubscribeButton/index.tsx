import { apiBaseUrl } from "next-auth/client/_utils";
import { useSession, signIn } from "next-auth/react";
import styles from "./styles.module.scss";
import { api } from "../../services/api";
import { getStripeJs } from "../../services/stripe-js";
import { useRouter } from "next/router";

interface SubscribeButtonProps {
  priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  // Checar se o usuário está logado (só permitir a assinatura dos usuário já logados)
  const session = useSession();
  const router = useRouter();

  async function handleSubscribe() {
    // Se não estiver logado, redirecionar usuário para fazer logIn
    if (!session) {
      signIn("github");
      return;
    }

    console.log(session);

    if (session.data?.activeSubscription) {
      router.push("/posts");
      return;
    }

    // Se estiver logado, cria a checkout session
    try {
      const response = await api.post("/subscribe");

      const { sessionId } = response.data;

      const stripe = await getStripeJs();

      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  );
}
