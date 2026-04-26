import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Dr. Sarah Chen',
    role: 'Professor of Cognitive Science, MIT',
    text: 'Cognitive Firewall is the intervention higher education has been waiting for. My students\' critical thinking scores improved 40% in one semester.',
    avatar: 'SC',
  },
  {
    name: 'Marcus Rivera',
    role: 'Engineering Lead, Stripe',
    text: 'We rolled this out to our junior engineers. The difference in problem-solving quality after 3 months was dramatic.',
    avatar: 'MR',
  },
  {
    name: 'Aisha Patel',
    role: 'Head of Learning, Deloitte',
    text: 'Finally, an AI tool that builds capability instead of replacing it. This is what responsible AI integration looks like.',
    avatar: 'AP',
  },
];

export const TestimonialsSection = () => (
  <section className="py-32">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          Trusted by <span className="gradient-primary-text">thinkers</span>
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="gradient-card rounded-2xl p-8"
          >
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, j) => (
                <Star key={j} className="w-4 h-4 fill-warning text-warning" />
              ))}
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed">"{t.text}"</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
                {t.avatar}
              </div>
              <div>
                <div className="font-semibold text-sm">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
