from sqlalchemy import String, Integer, ForeignKey, DateTime, func, Enum
from sqlalchemy.orm import Mapped, mapped_column
from ..database import Base
from datetime import datetime

class SessionToken(Base):
    __tablename__ = "sessions"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, index=True)
    role: Mapped[str] = mapped_column(Enum("reviewer", "owner"), nullable=False)
    reviewer_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("reviewers.id", ondelete = "CASCADE"), nullable = True)
    owner_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("owners.id", ondelete = "CASCADE"), nullable = True)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())