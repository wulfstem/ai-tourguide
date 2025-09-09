"""fix locations

Revision ID: 927efaac8b88
Revises: 0ffae72586b9
Create Date: 2025-08-28 10:25:48.139087

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import func


# revision identifiers, used by Alembic.
revision = '927efaac8b88'
down_revision = '0ffae72586b9'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'locations',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('title', sa.String(200), nullable=False),
        sa.Column('category', sa.String(100), nullable=False),
        sa.Column('latitude', sa.Float, nullable=False),
        sa.Column('longitude', sa.Float, nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=func.now(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_locations_category_title', 'locations', ['category', 'title'])


def downgrade() -> None:
    op.drop_index('ix_locations_category_title', table_name='locations')
    op.drop_table('locations')
